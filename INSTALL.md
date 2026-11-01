# Install Terpal (setup guide)

Terpal is a tiny pet that lives above your Claude Code prompt. This takes about a minute.

You need [Claude Code](https://claude.com/claude-code) version 2.1.275 or later, in a terminal.

## Option 1: ask Claude Code to do it

Start `claude` in any folder and paste this:

> Install the Claude Code plugin "codepet" from the GitHub marketplace ToniRajinCoding/terpal at user scope. Run `claude plugin marketplace add ToniRajinCoding/terpal` and then `claude plugin install codepet@terpal`. Then tell me to start a new Claude Code session to see the pet. Do not change any other settings.

If Claude Code asks for permission to run those commands, approve them. They only add the plugin and nothing else.

## Option 2: do it yourself

Inside a Claude Code session, type:

```
/plugin install codepet --marketplace ToniRajinCoding/terpal
```

Answer `y` to add the marketplace, then choose the **user** scope so the pet shows up in every session.

Or from a normal shell:

```
claude plugin install codepet --marketplace ToniRajinCoding/terpal
```

## Check it works

Start a new `claude` session. You should see the pet above the prompt, for example `[o_o]  ready when you are`. Type a long message or ask Claude to do something, and watch it react.

## Choose your pet

```
/petskin cat      classic kaomoji cat
/petskin tiny     tiny 2-line cat
/petskin robot    robot (default)
```

Pet it with `/pet`, or feed it with `/pet feed`.

## Troubleshooting

- **No pet shows up:** start a new `claude` session. Run `claude plugin list` and check that `codepet` is there and enabled.
- **"Plugin not found":** check the spelling of the marketplace (`ToniRajinCoding/terpal`) and update Claude Code.
- **The pet looks broken:** your terminal font may not show some symbols (such as `♪` or `✎`). Try a font with wider symbol support.
- **Private repo errors:** if the repo is private, you need to be invited and signed in to GitHub (`gh auth login`, then `gh auth setup-git`).

## Turn it off or remove it

```
claude plugin uninstall codepet
```

## Privacy

Terpal runs only on your computer. It makes no network requests, has no analytics or tracking, and sends nothing anywhere. It does not read your files. It only watches Claude Code events (such as a tool starting or a prompt being edited) to pick a face. The one thing it saves is your chosen pet (`cat`, `tiny` or `robot`), in Claude Code's local plugin storage.

## License

Free for personal, noncommercial use under the [PolyForm Noncommercial License 1.0.0](LICENSE).
