export type Mood =
  | 'idle' | 'fidget' | 'typing' | 'startled' | 'working' | 'reading' | 'editing' | 'searching'
  | 'curious' | 'impatient' | 'dizzy' | 'shipped' | 'happy' | 'sad' | 'sleeping' | 'petted' | 'fed' | 'teased'

export type Skin = 'cat' | 'tiny' | 'robot'

declare module 'claude-code' {
  interface PluginState {
    codepet: { mood: Mood; tick: number; line: string; skin: Skin }
  }
}
