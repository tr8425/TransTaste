import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:3001";
const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const profile = path.resolve("output/qa-edge-profile");
const port = 9333;
await rm(profile, { recursive: true, force: true });
await mkdir(profile, { recursive: true });

const browser = spawn(edge, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--disable-background-networking",
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--window-size=480,932", "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitForJson(url) {
  for (let i = 0; i < 50; i++) {
    try { return await (await fetch(url)).json(); } catch { await sleep(100); }
  }
  throw new Error(`CDP unavailable: ${url}`);
}

const tabs = await waitForJson(`http://127.0.0.1:${port}/json/list`);
const tab = tabs.find((entry) => entry.type === "page");
if (!tab) throw new Error("No Edge page target");

const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 1;
const pending = new Map();
const pageErrors = [];
const consoleErrors = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(new Error(message.error.message)) : resolve(message.result);
  }
  if (message.method === "Runtime.exceptionThrown") pageErrors.push(message.params.exceptionDetails.text);
  if (message.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(message.params.type)) {
    consoleErrors.push(message.params.args.map((arg) => arg.value ?? arg.description ?? "").join(" "));
  }
});

function send(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function navigate(route) {
  await send("Page.navigate", { url: `${baseUrl}${route}` });
  for (let i = 0; i < 60; i++) {
    if (await evaluate("document.readyState === 'complete'")) break;
    await sleep(100);
  }
  await sleep(350);
}

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Network.setBlockedURLs", { urls: [`${baseUrl}/api/*`, "*/api/*"] });

const results = [];
function check(name, pass, detail = "") { results.push({ name, pass: Boolean(pass), detail }); }

const routes = ["/", "/travel", "/phrases", "/foods", "/guide", "/pricing", "/profile", "/faq", "/terms", "/privacy", "/tip-culture", "/history", "/order", "/camera"];
for (const route of routes) {
  await navigate(route);
  const state = await evaluate(`({
    path: location.pathname,
    text: document.body.innerText.trim().slice(0, 120),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    interactive: document.querySelectorAll('a,button,input,select,textarea').length
  })`);
  check(`route ${route} renders`, state.path === route && state.text.length > 0, JSON.stringify(state));
  check(`route ${route} no horizontal overflow`, state.overflow <= 1, `overflow=${state.overflow}`);
}

await navigate("/");
let action = await evaluate(`(() => {
  const button=[...document.querySelectorAll('button')].find((el)=>el.textContent.includes('Other ways'));
  button?.click(); return Boolean(button);
})()`);
await sleep(100);
let state = await evaluate(`({expanded:document.querySelector('[aria-controls="other-input-methods"]')?.getAttribute('aria-expanded'), choices:document.querySelectorAll('#other-input-methods button').length})`);
check("home expands alternate inputs", action && state.expanded === "true" && state.choices === 3, JSON.stringify(state));

action = await evaluate(`(() => { const b=[...document.querySelectorAll('#other-input-methods button')].find((el)=>el.textContent.trim()==='URL'); b?.click(); return Boolean(b); })()`);
await sleep(100);
state = await evaluate(`({dialog:!!document.querySelector('[role="dialog"]'), disabled:document.querySelector('[role="dialog"] button:disabled')?.disabled===true})`);
check("URL modal opens with invalid submit disabled", action && state.dialog && state.disabled, JSON.stringify(state));
await evaluate(`(() => { const i=document.querySelector('[role="dialog"] input'); const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; s.call(i,'https://example.com/menu.jpg'); i.dispatchEvent(new Event('input',{bubbles:true})); })()`);
await sleep(100);
state = await evaluate(`({enabled:document.querySelector('[role="dialog"] button:last-child')?.disabled===false})`);
check("URL modal enables valid URL", state.enabled, JSON.stringify(state));
await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
await sleep(100);
check("URL modal closes with Escape", !(await evaluate("Boolean(document.querySelector('[role=dialog]'))")));

await navigate("/");
await evaluate(`[...document.querySelectorAll('button')].find((el)=>el.textContent.includes('sample menu'))?.click()`);
await sleep(350);
check("sample menu navigates to setup", await evaluate("location.pathname === '/scan-setup'"), await evaluate("location.pathname"));

await navigate("/travel");
state = await evaluate(`([...document.querySelectorAll('a')].filter((a)=>['/phrases','/tip-culture','/order'].includes(a.getAttribute('href'))).map((a)=>a.getAttribute('href'))) `);
check("travel tools expose all destinations", new Set(state).size === 3, JSON.stringify(state));

await navigate("/phrases");
state = await evaluate(`({languages:[...document.querySelectorAll('button[title]')].length,categories:[...document.querySelectorAll('button')].filter((b)=>['Basics','Ordering','Payment'].some((x)=>b.textContent.includes(x))).length})`);
check("phrase language and category controls render", state.languages >= 5 && state.categories >= 3, JSON.stringify(state));
state = await evaluate(`(() => { const b=[...document.querySelectorAll('button[title]')].find((el)=>el.textContent.includes('CN')); b?.click(); return Boolean(b); })()`);
await sleep(100);
check("phrase language selection changes active state", state && await evaluate(`([...document.querySelectorAll('button[title]')].find((el)=>el.textContent.includes('CN'))?.className.includes('bg-coral'))`));

await navigate("/profile");
state = await evaluate(`({tabs:document.querySelectorAll('nav[aria-label] a[href^="#profile-"]').length, selects:document.querySelectorAll('select').length})`);
check("profile navigation and selectors render", state.tabs === 4 && state.selects >= 2, JSON.stringify(state));
await evaluate(`document.querySelector('a[href="#profile-language"]')?.click()`);
await sleep(100);
check("profile section navigation updates hash", await evaluate("location.hash === '#profile-language'"), await evaluate("location.hash"));

await navigate("/faq");
state = await evaluate(`(() => { const d=document.querySelector('details'); d?.querySelector('summary')?.click(); return d?.open; })()`);
check("FAQ disclosure opens", state === true, String(state));

await navigate("/tip-culture");
state = await evaluate(`(() => { const b=[...document.querySelectorAll('button')].find((el)=>el.textContent.includes('Korea')); b?.click(); return Boolean(b); })()`);
await sleep(100);
check("country selector changes active country", state && await evaluate(`([...document.querySelectorAll('button')].find((el)=>el.textContent.includes('Korea'))?.className.includes('bg-coral'))`));

await navigate("/");
await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab" });
await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab" });
state = await evaluate(`({tag:document.activeElement?.tagName,outline:getComputedStyle(document.activeElement).outlineWidth})`);
check("keyboard Tab reaches visible focus", ["A","BUTTON"].includes(state.tag) && parseFloat(state.outline) >= 3, JSON.stringify(state));

await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await navigate("/");
state = await evaluate(`getComputedStyle(document.querySelector('.mengto-enter')).animationDuration`);
check("reduced motion resolves immediately", parseFloat(state) <= 0.01, state);

await navigate("/camera");
await sleep(500);
state = await evaluate(`({frame:!!document.querySelector('video'),gallery:!![...document.querySelectorAll('button')].find((b)=>b.getAttribute('aria-label')?.toLowerCase().includes('gallery')),capture:!![...document.querySelectorAll('button')].find((b)=>b.getAttribute('aria-label')?.toLowerCase().includes('photo'))})`);
check("camera controls render without API", state.frame && state.gallery && state.capture, JSON.stringify(state));

check("no uncaught page errors", pageErrors.length === 0, JSON.stringify(pageErrors));
check("no console errors", consoleErrors.length === 0, JSON.stringify(consoleErrors));

const failed = results.filter((item) => !item.pass);
for (const item of results) console.log(`${item.pass ? "PASS" : "FAIL"} | ${item.name}${item.detail ? ` | ${item.detail}` : ""}`);
console.log(`SUMMARY | ${results.length - failed.length}/${results.length} passed`);

socket.close();
browser.kill();
await sleep(500);
try { await rm(profile, { recursive: true, force: true, maxRetries: 4, retryDelay: 250 }); } catch { /* Edge may release dictionaries after process exit. */ }
process.exitCode = failed.length ? 1 : 0;
