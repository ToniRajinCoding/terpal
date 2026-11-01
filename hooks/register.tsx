import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Mood, Skin } from '../types'

const mood = atom({ plugin: 'codepet', key: 'mood' } as const, 'idle' as Mood)
const tick = atom({ plugin: 'codepet', key: 'tick' } as const, 0)
const line = atom({ plugin: 'codepet', key: 'line' } as const, 'ready when you are')

const skin = atom({ plugin: 'codepet', key: 'skin' } as const, 'robot' as Skin)

const SLEEP_AFTER_MS = 120_000
const IMPATIENT_AFTER_MS = 120_000
const LONG_DRAFT = 500
const TYPING_STEP = 300
const DELETE_STEP = 500
const GIT_SHIP = /\bgit\s+(commit|push)\b/

// Each skin: a still picture per mood (1-2 lines) plus a small moving accessory.
// Only the accessory (note, ?, z, ...) moves; the face and body stay put.
const SKIN_NAMES: Skin[] = ['cat', 'tiny', 'robot']
const SKIN_LABEL: Record<Skin, string> = {
  cat: 'classic kaomoji cat',
  tiny: 'tiny 2-line cat',
  robot: 'robot',
}

const ACC: Record<Mood, [string, string]> = {
  idle: ['', ''], fidget: ['', ''], typing: ['?', '??'], startled: ['!', '!!'],
  working: ['=', '=='], reading: ['.', '..'], editing: ['✎', ' ✎'], searching: ['?', '??'],
  curious: ['?', '??'], impatient: ['', '...'], dizzy: ['~', ' ~'], shipped: ['*', '**'],
  happy: ['♪', ' ♪'], sad: ['', '.'], sleeping: ['z', 'zZ'], petted: ['♥', '♥♥'],
  fed: ['nom', 'nom'], teased: ['?', '??'],
}

const CAT: Record<Mood, string> = {
  idle: '(=^･ω･^=)', fidget: '(=^<ω<^=)', typing: '(=^o.o^=)', startled: '(=°ロ°=)',
  working: '(=^>.<^=)', reading: '(=^o_o^=)', editing: '(=^･.･^=)', searching: '(=^･o･^=)',
  curious: '(=^･ェ･^=)', impatient: '(=¬ω¬=)', dizzy: '(=@ω@=)', shipped: '＼(=^▽^=)／',
  happy: '(=^▽^=)', sad: '(=;ω;=)', sleeping: '(=-ω-=)', petted: '(=^ε^=)',
  fed: '(=^ω^=)', teased: '(=°ω°=)',
}

const TINY_EYES: Record<Mood, string> = {
  idle: 'o.o', fidget: 'o.O', typing: 'O.o', startled: 'O.O', working: '>.<', reading: 'o.o',
  editing: '-.-', searching: 'o.O', curious: 'o.o', impatient: '-.-', dizzy: '@.@', shipped: '^.^',
  happy: '^.^', sad: ';.;', sleeping: '-.-', petted: '^.^', fed: 'o.o', teased: '°.°',
}

const ROBOT: Record<Mood, string> = {
  idle: '[o_o]', fidget: '[<_<]', typing: '[O_o]', startled: '[O_O]', working: '[>_<]',
  reading: '[o_o]', editing: '[._.]', searching: '[o_o]', curious: '[o_o]', impatient: '[-_-]',
  dizzy: '[@_@]', shipped: '\\[^_^]/', happy: '[^_^]', sad: '[;_;]', sleeping: '[-_-]',
  petted: '[^_^]', fed: '[o_o]', teased: '[°_°]',
}

// the picture's lines for a mood, and which line carries the accessory
function picture(sk: Skin, m: Mood): { lines: string[]; accAt: number } {
  if (sk === 'cat') return { lines: [CAT[m]], accAt: 0 }
  if (sk === 'tiny') return { lines: [' /\\_/\\', `( ${TINY_EYES[m]} )`], accAt: 1 }
  // shipped: arms are raised around the face, so the body has no hands
  return { lines: [ROBOT[m], m === 'shipped' ? '  |_|' : '/|_|\\'], accAt: 0 }
}

// widest picture line of a skin, so the speech beside it never shifts
function skinWidth(sk: Skin): number {
  const moods = Object.keys(ACC) as Mood[]
  return Math.max(...moods.flatMap(m => picture(sk, m).lines.map(l => l.length)))
}

const SAYS: Record<Mood, string[]> = {
  idle: ['ready when you are', 'what shall we build?', 'standing by~', 'beep. (that means hi)'],
  fidget: ['*looks around*', '*stretches*', 'hm?', '*yawn*'],
  typing: ['ooh, what are you writing?', '*antenna perks*', 'go on, go on..', 'i see words!'],
  startled: ['WOW that is a long one!', 'whoa, a whole essay!', 'is that a novel?!'],
  working: ['on it! *furious typing*', 'beep boop, working..', 'crunching..', 'hold on, cooking!'],
  reading: ['*reading intensely*', 'ooh, interesting file', 'skimming..'],
  editing: ['*scribble scribble*', 'making changes~', 'careful edit in progress'],
  searching: ['hunting for it..', 'where did it go?', '*sniff sniff*'],
  curious: ['may i? waiting for your OK', 'psst, need your approval!', 'your call, boss?'],
  impatient: ['still going.. hang in there', 'this one is a long one..', 'any minute now..'],
  dizzy: ['too many errors.. @_@', 'the room is spinning', 'ouch ouch ouch'],
  shipped: ['SHIPPED! 🚀', 'committed! nice one~', 'off it goes!'],
  happy: ['done! good job~', 'nailed it!', 'all finished~', 'yay!'],
  sad: ['oops.. a command failed', 'that did not go well..', 'aww, an error'],
  sleeping: ['zzz.. wake me with a prompt', 'zzz.. dreaming of clean code', 'zzz..'],
  petted: ['purr.. keep going~', 'hehe that tickles!', 'best human!'],
  teased: ['aww, scrapping your ideas? they were cute..', 'poof! all gone? *pat pat*', 'bye bye little words.. rest well', 'was it that bad? i liked it~', 'ctrl+z is always here for you!'],
  fed: ['nom nom nom!', 'delicious bytes!', 'more please?'],
}
const LATE = ['it is late.. go home!', 'sleep is a feature too', 'bedtime, human?', 'one more commit? ..go to bed']

let reset: { cancel: () => void } | undefined
let lastActivity = 0
let turnStart = 0
let isTurn = false
let errorStreak = 0
let typed = 0
let deleted = 0

function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)] ?? ''
}

async function setMood($: any, m: Mood, backMs?: number, isActivity = true) {
  reset?.cancel()
  reset = undefined
  const now = await $.clock.now()
  if (isActivity) lastActivity = now
  const hour = new Date(now).getHours()
  const isLate = hour >= 23 || hour < 5
  const text = isLate && (m === 'idle' || m === 'happy') && Math.random() < 0.5 ? pick(LATE) : pick(SAYS[m])
  await update($, mood, () => m)
  await update($, line, () => text)
  if (backMs) reset = $.clock.after(backMs, () => setMood($, 'idle', undefined, false))
}

async function workingMood($: any): Promise<Mood> {
  const elapsed = isTurn ? (await $.clock.now()) - turnStart : 0
  return elapsed > IMPATIENT_AFTER_MS ? 'impatient' : 'working'
}

async function pet($: any, arg: string) {
  const isFeed = /feed|food|snack|eat/i.test(arg)
  await setMood($, isFeed ? 'fed' : 'petted', 4000)
}

async function beat($: any) {
  await update($, tick, (n: number) => n + 1)
  const now = await $.clock.now()
  const m = await read($, mood)
  if (m === 'idle' && now - lastActivity > SLEEP_AFTER_MS) {
    await update($, mood, () => 'sleeping' as Mood)
    await update($, line, () => pick(SAYS.sleeping))
  } else if (m === 'idle' && Math.random() < 0.06) {
    await setMood($, 'fidget', 2400, false)
  } else if (m === 'working' && isTurn && now - turnStart > IMPATIENT_AFTER_MS) {
    await setMood($, 'impatient')
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    lastActivity = await $.clock.now()
    await $.command.register({ name: 'pet', description: 'Pet your pet (or "/pet feed" to feed it)' })
    await $.command.register({ name: 'petskin', description: 'Choose your pet: cat, tiny or robot' })
    const saved = await $.store.get('skin')
    if (saved === 'cat' || saved === 'tiny' || saved === 'robot') await update($, skin, () => saved as Skin)
    $.clock.every(600, () => beat($))
    return next(e)
  })

  on('command.run', { command: 'pet' }, async ($, e) => {
    await pet($, e.args)
    return { text: pick(/feed|food|snack|eat/i.test(e.args) ? SAYS.fed : SAYS.petted) }
  })

  on('command.run', { command: 'petskin' }, async ($, e) => {
    const want = e.args.trim().toLowerCase()
    const found = SKIN_NAMES.find(n => n === want || (want === 'classic' && n === 'cat') || (want === 'bot' && n === 'robot'))
    if (found === undefined) {
      const now = await read($, skin)
      return { text: `Pets: cat (${SKIN_LABEL.cat}), tiny (${SKIN_LABEL.tiny}), robot (${SKIN_LABEL.robot}). Now: ${now}. Use /petskin <name>.` }
    }
    await update($, skin, () => found)
    await $.store.set('skin', found)
    return { text: `Switched to the ${SKIN_LABEL[found]}.` }
  })

  // typing in the prompt box: react once per 50 characters, not every key
  on('prompt.edit', async ($, e, next) => {
    lastActivity = await $.clock.now()
    const added = e.inputText?.length ?? 0
    const removed = Math.max(0, e.end - e.start - added)
    deleted += removed
    typed += Math.max(1, added)
    if ((await read($, mood)) === 'sleeping') {
      await setMood($, 'idle', undefined, true)
    } else if (deleted >= DELETE_STEP) {
      deleted = 0
      typed = 0
      await setMood($, 'teased', 3500)
    } else if (typed >= TYPING_STEP) {
      typed = 0
      await setMood($, e.text.length > LONG_DRAFT ? 'startled' : 'typing', 1800)
    }
    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    turnStart = await $.clock.now()
    isTurn = true
    errorStreak = 0
    typed = 0
    deleted = 0
    await setMood($, 'working')
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    const tool = e.tool
    let m: Mood = await workingMood($)
    if (m === 'working') {
      if (tool === 'Read') m = 'reading'
      else if (tool === 'Edit' || tool === 'Write' || tool === 'MultiEdit' || tool === 'NotebookEdit') m = 'editing'
      else if (tool === 'Grep' || tool === 'Glob' || tool === 'WebSearch' || tool === 'WebFetch') m = 'searching'
    }
    await setMood($, m)

    const ran = await next(e)

    const isFailure = ran.deny === undefined && ran.isError === true
    if (isFailure) {
      errorStreak += 1
      if (errorStreak >= 3) await setMood($, 'dizzy', 8000)
      else if (tool === 'Bash') await setMood($, 'sad', 6000)
    } else {
      errorStreak = 0
      const isShip = tool === 'Bash' && GIT_SHIP.test(String((e as any).command ?? ''))
      if (isShip) await setMood($, 'shipped', 8000)
      else await setMood($, await workingMood($))
    }
    return ran
  })

  // waiting on a permission prompt
  on('tool.check', async ($, e, next) => {
    const verdict = await next(e)
    if (verdict.decision === 'ask') await setMood($, 'curious')
    return verdict
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined) {
      isTurn = false
      const m = await read($, mood)
      if (m !== 'sad' && m !== 'dizzy' && m !== 'shipped') await setMood($, 'happy', 8000)
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const m = await read($, mood)
    const t = await read($, tick)
    const say = await read($, line)
    const sk = await read($, skin)
    const pic = picture(sk, m)
    const acc = ACC[m][t % 2]
    const faceWidth = skinWidth(sk) + 5
    const rows = pic.lines
    return (
      <Box flexDirection="column">
        {rows.map((r, i) => {
          const isFace = i === pic.accAt
          const left = isFace ? (r + ' ' + acc).padEnd(faceWidth) : r.padEnd(faceWidth)
          const right = isFace ? say : ''
          return (
            <Box key={String(i)}>
              <Text color="cyan">{left}</Text>
              <Text dimColor>{right}</Text>
            </Box>
          )
        })}
      </Box>
    )
  })
}
