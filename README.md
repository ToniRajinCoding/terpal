# Terpal

A tiny pal for your terminal. It sits above your Claude Code prompt, watches you work, and has opinions.

```
[o_o]    what shall we build?
/|_|\
```

It does not write code. It does not fix bugs. It just reacts to the person who does, which is you, and to Claude, who does the actual work.

---

## Get it

The easy way: open `claude` and paste this.

> Install the Claude Code plugin "codepet" from the GitHub marketplace ToniRajinCoding/terpal at user scope. Run `claude plugin marketplace add ToniRajinCoding/terpal` and then `claude plugin install codepet@terpal`. Then tell me to start a new Claude Code session. Don't change any other settings.

Yes, you are asking Claude to install a pet for Claude. Welcome to the future.

<details>
<summary>Prefer to type it yourself?</summary>

Inside Claude Code:

```
/plugin install codepet --marketplace ToniRajinCoding/terpal
```

Say `y` to add the marketplace, then pick **user** scope.

Or from a normal terminal:

```
claude plugin install codepet --marketplace ToniRajinCoding/terpal
```

</details>

Need the longer version with troubleshooting? It's in [INSTALL.md](INSTALL.md).

## Does it start by itself?

Yes. Install it once at **user** scope and your pal shows up in every new Claude session. There's nothing to turn on, no setup file, no ritual. Open `claude` and it's there, probably judging you.

It lives in the terminal, above the prompt. If it isn't there, start a fresh session and check `claude plugin list`.

---

## Pick your pal

Three of them, all equally unbothered:

```
cat                tiny              robot (default)
(=^･ω･^=)           /\_/\             [o_o]
                   ( o.o )           /|_|\
```

Switch any time:

| Type this | Get this |
|---|---|
| `/petskin cat` | the classic cat |
| `/petskin tiny` | the tiny two-line cat |
| `/petskin robot` | the robot |

It remembers your choice, so you only have to pick once.

## What it does all day

It reacts to what's going on. Roughly:

| What's happening | What your pal does |
|---|---|
| Nothing | Stands there. Occasionally looks around like it heard something. |
| You're typing | Perks up every few hundred characters, to show it's paying attention. |
| You paste a wall of text | Startled. Understandably. |
| You delete a lot of text | Gently teases you for scrapping your ideas. |
| Claude is working | Busy, with different faces for reading, editing and searching. |
| Claude needs your OK | Curious, waiting for you to click the thing. |
| A turn takes forever | Impatient. Same. |
| Three errors in a row | Dizzy. Also same. |
| You commit or push | Celebrates. A little too proud of you. |
| Claude finishes | Happy. |
| Something fails | Sad. |
| You go quiet for 2 minutes | Falls asleep. Typing wakes it up. |
| It's very late | Suggests you go to bed. You won't. |

Only the tiny symbol next to the face moves (a note, a question mark, a `z`). The rest holds still, so it isn't a distraction. Probably.

## Play with it

```
/pet          give it a pat
/pet feed     give it a snack
```

It says something different each time. No, you can't make it stop saying "nom".

## Is it watching me?

It's a face, not a spy. Here's the full picture:

- It runs only on your computer.
- It makes no network requests and has no analytics or tracking.
- It doesn't read your files. It only notices things like "Claude started a task" or "you typed something" to pick a face.
- The only thing it saves is which pal you chose.

<details>
<summary>Want to double check?</summary>

The whole thing is one small file: `hooks/register.tsx`. Read it, it's short and has no secrets.

</details>

## Remove it

```
claude plugin uninstall codepet
```

It won't make a scene. Probably.

## Fine print

Free for personal and other noncommercial use, under the [PolyForm Noncommercial License 1.0.0](LICENSE). Install it, share it with friends, tinker with it. Please don't sell it. If you share it, keep the `Required Notice` line in `LICENSE`.

Made by [ToniRajinCoding](https://github.com/ToniRajinCoding).
