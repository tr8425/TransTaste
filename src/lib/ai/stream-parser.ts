/**
 * Incremental parser that extracts menu_meta and dish objects
 * from a streaming JSON response, one chunk at a time.
 */
export class IncrementalDishParser {
  private buffer = '';
  private dishesArrayFound = false;
  private dishesArrayDone = false;
  private scanPos = 0;
  private braceDepth = 0;
  private dishStart = -1;
  private inString = false;
  private escaped = false;
  private metaExtracted = false;

  public menuMeta: Record<string, unknown> | null = null;

  /**
   * Feed a new text chunk. Returns any newly completed meta/dish objects.
   */
  addChunk(chunk: string): { newMeta: Record<string, unknown> | null; newDishes: unknown[] } {
    this.buffer += chunk;
    const newDishes: unknown[] = [];
    let newMeta: Record<string, unknown> | null = null;

    // Extract menu_meta (small object, appears before dishes)
    if (!this.metaExtracted) {
      const metaIdx = this.buffer.indexOf('"menu_meta"');
      if (metaIdx !== -1) {
        const braceIdx = this.buffer.indexOf('{', metaIdx + 11);
        if (braceIdx !== -1) {
          let depth = 0;
          for (let i = braceIdx; i < this.buffer.length; i++) {
            if (this.buffer[i] === '{') depth++;
            if (this.buffer[i] === '}') depth--;
            if (depth === 0) {
              try {
                this.menuMeta = JSON.parse(this.buffer.slice(braceIdx, i + 1));
                newMeta = this.menuMeta;
                this.metaExtracted = true;
              } catch { /* incomplete */ }
              break;
            }
          }
        }
      }
    }

    // Find dishes array start; stop scanning once array is closed
    if (this.dishesArrayDone) return { newMeta, newDishes };

    if (!this.dishesArrayFound) {
      const idx = this.buffer.indexOf('"dishes"');
      if (idx === -1) return { newMeta, newDishes };
      const bracketIdx = this.buffer.indexOf('[', idx);
      if (bracketIdx === -1) return { newMeta, newDishes };
      this.dishesArrayFound = true;
      this.scanPos = bracketIdx + 1;
    }

    // Scan for complete dish objects (brace-balanced, string-aware)
    for (let i = this.scanPos; i < this.buffer.length; i++) {
      const ch = this.buffer[i];

      if (this.escaped) {
        this.escaped = false;
        continue;
      }
      if (ch === '\\' && this.inString) {
        this.escaped = true;
        continue;
      }
      if (ch === '"') {
        this.inString = !this.inString;
        continue;
      }
      if (this.inString) continue;

      if (ch === '{') {
        if (this.braceDepth === 0) this.dishStart = i;
        this.braceDepth++;
      } else if (ch === '}') {
        this.braceDepth--;
        if (this.braceDepth === 0 && this.dishStart !== -1) {
          try {
            const dish = JSON.parse(this.buffer.slice(this.dishStart, i + 1));
            newDishes.push(dish);
          } catch { /* incomplete */ }
          this.dishStart = -1;
        }
      } else if (ch === ']' && this.braceDepth === 0) {
        this.dishesArrayDone = true;
        break; // End of dishes array — stop scanning permanently
      }
    }

    this.scanPos = this.buffer.length;
    return { newMeta, newDishes };
  }

  getBuffer(): string {
    return this.buffer;
  }
}
