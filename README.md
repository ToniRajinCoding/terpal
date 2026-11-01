# Terpal (terminal pal)

A tiny pet that lives above your Claude Code prompt and reacts to what you and Claude are doing.

```
[o_o]    what shall we build?
/|_|\
```

## Install

In a Claude Code session, type:

```
/plugin install codepet --marketplace ToniRajinCoding/terpal
```

Answer `y` to add the marketplace, then choose the **user** scope (so the pet shows up in every session). The pet appears right away.

From a normal shell instead:

```
claude plugin install codepet --marketplace ToniRajinCoding/terpal
```

If the repository is private, you need to be invited on GitHub and have GitHub set up on your computer (`gh auth login`, then `gh auth setup-git`).

## Choose your pal

Three pets are included. Switch any time:

| Command | Pet |
|---|---|
| `/petskin cat` | classic kaomoji cat `(=^･ω･^=)` |
| `/petskin tiny` | tiny 2-line cat |
| `/petskin robot` | robot `[o_o]` (default) |

Your choice is remembered across sessions. `/petskin` alone lists the options.

## How it reacts

| What happens | The pet |
|---|---|
| Waiting | idle, sometimes looks around |
| You type (every 300 characters) | perks up |
| You paste or write a very long prompt (500+ characters) | startled |
| You delete 500+ characters | teases you about scrapping your ideas |
| Claude works | busy, with different looks for reading, editing and searching |
| Claude needs your approval | curious |
| A turn takes over 2 minutes | impatient |
| 3 errors in a row | dizzy |
| A `git commit` or `git push` succeeds | celebrates "shipped!" |
| A turn finishes | happy |
| A command fails | sad |
| 2 minutes of nothing | falls asleep, wakes when you type |
| Late at night (11pm to 5am) | tells you to go to bed |

Pet it with `/pet`, or feed it with `/pet feed`.

Only the little accessory next to the face moves (a note, a question mark, `zZ`). The face and speech stay still, so it is not distracting.

## Turn it off

```
claude plugin uninstall codepet
```

## Tips

- If you do not see the pet after installing, start a new `claude` session.
- It only draws in the terminal, above the prompt.

## License

Terpal is free for personal and other noncommercial use, under the [PolyForm Noncommercial License 1.0.0](LICENSE). You can install it, use it, share it with friends and tinker with it. You cannot sell it or use it for commercial purposes. Please keep the `Required Notice` line from `LICENSE` if you share it.
