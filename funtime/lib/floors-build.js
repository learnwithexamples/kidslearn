/* ============================================================
   floors-build.js — the Hundred Floors workshop's demos
   ============================================================ */

(function () {
    'use strict';

    const SCALE = 0.66;

    const NAMES = {};
    NAMES[PLAIN] = 'plain';
    NAMES[SPIKED] = 'spiked (锯齿)';
    NAMES[SLIDE_LEFT] = 'slides left';
    NAMES[SLIDE_RIGHT] = 'slides right';
    NAMES[SPRING] = 'spring';
    NAMES[CRUMBLING] = 'crumbling';

    let demo = null;
    let demoKind = 'kinds';
    let demoFlags = {};

    /** showcase — a hand-made shaft with one of every kind of platform in it. */
    function showcase() {
        const state = createGame();
        state.platforms = [];
        [PLAIN, SPIKED, SLIDE_LEFT, SLIDE_RIGHT, SPRING, CRUMBLING]
            .forEach(function (kind, i) {
                state.platforms.push({
                    x: 30 + (i % 2) * 130,
                    y: 60 + i * 58,
                    kind: kind,
                    floor: i + 1,
                    crumbling: 0
                });
            });
        state.player.x = 40;
        state.player.y = 36;
        state.player.riding = null;
        state.looking = 0;
        return state;
    }

    /** startDemo — build whatever the current step wants to show. */
    function startDemo(step) {
        demoKind = (step.demo && step.demo.kind) || 'kinds';
        demoFlags = (step.demo && step.demo.flags) || {};

        if (demoKind === 'kinds' || demoKind === 'land') {
            demo = showcase();
        } else {
            demo = createGame();
        }
    }

    /** robotClimber — a robot player: plan once on landing, then walk that way. */
    function robotClimber(state) {
        const player = state.player;
        if (state.plan === undefined || player.riding !== state.plannedFrom) {
            const feet = player.y + PLAYER_HEIGHT;
            const below = state.platforms
                .filter(function (q) { return q.y > feet + 2; })
                .sort(function (a, b) { return a.y - b.y; })
                .slice(0, 3);
            const nice = below.filter(function (q) {
                return q.kind !== SPIKED && q.kind !== SPRING;
            });
            const choices = nice.length > 0 ? nice : below;
            if (choices.length > 0) {
                let target = choices[0];
                choices.forEach(function (q) {
                    if (Math.abs(q.x - player.x) < Math.abs(target.x - player.x)) { target = q; }
                });
                let want = target.x + PLATFORM_WIDTH / 2 - PLAYER_WIDTH / 2;
                const here = player.riding;
                if (here) {
                    const ways = [here.x - PLAYER_WIDTH - 2, here.x + PLATFORM_WIDTH + 2]
                        .filter(function (x) { return x >= 0 && x <= FIELD_WIDTH - PLAYER_WIDTH; });
                    if (ways.length > 0) {
                        want = ways[0];
                        ways.forEach(function (x) {
                            if (Math.abs(x - want) < 0) { want = x; }
                        });
                        want = ways.reduce(function (best, x) {
                            return Math.abs(x - (target.x + PLATFORM_WIDTH / 2 - PLAYER_WIDTH / 2)) <
                                   Math.abs(best - (target.x + PLATFORM_WIDTH / 2 - PLAYER_WIDTH / 2)) ? x : best;
                        }, ways[0]);
                    }
                }
                state.plan = want;
                state.plannedFrom = here;
            }
        }
        const gap = (state.plan === undefined ? player.x : state.plan) - player.x;
        state.steering = Math.abs(gap) < 2 ? 0 : (gap > 0 ? 1 : -1);
    }

    /** updateDemo — one frame of whichever practice shaft is showing. */
    function updateDemo(elapsed) {
        if (demoKind === 'land') {
            /* just gravity and landings — the shaft stays still so you can watch */
            const player = demo.player;
            const seconds = elapsed / 1000;
            walkPlayer(demo, seconds);
            if (player.riding && !stillOnPlatform(player, player.riding)) {
                player.riding = null;
            }
            if (!player.riding) {
                player.lastFeet = player.y + PLAYER_HEIGHT;
                player.dy = Math.min(MAX_FALL_SPEED, player.dy + GRAVITY * seconds);
                player.y = player.y + player.dy * seconds;
                for (let i = 0; i < demo.platforms.length; i++) {
                    if (landsOn(player, demo.platforms[i])) {
                        landOnPlatform(demo, demo.platforms[i]);
                        break;
                    }
                }
            }
            if (player.y > FIELD_HEIGHT) {
                startDemo({ demo: { kind: demoKind, flags: demoFlags } });
            }

        } else if (demoKind === 'game' || demoKind === 'final') {
            if (demoFlags.robot) { robotClimber(demo); }
            updateGame(demo, elapsed);
            if (demo.isOver) { startDemo({ demo: { kind: demoKind, flags: demoFlags } }); }
        }
    }

    /** drawDemo — draw the current demo, shrunk to fit the panel. */
    function drawDemo(ctx, canvas, setNote) {
        ctx.save();
        try {
            ctx.scale(SCALE, SCALE);
            renderGame(ctx, demo);

            if (demoKind === 'kinds') {
                const here = demo.platforms[demo.looking || 0];
                const y = screenY(demo, here.y);
                ctx.strokeStyle = '#111111';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 4]);
                ctx.strokeRect(here.x - 4, y - 14, PLATFORM_WIDTH + 8, PLATFORM_HEIGHT + 20);
                ctx.setLineDash([]);
                setNote('kind ' + here.kind + ' — ' + NAMES[here.kind]);

            } else if (demoKind === 'land') {
                const riding = demo.player.riding;
                setNote((riding ? 'standing on ' + NAMES[riding.kind] : 'falling') +
                        '  •  blood ' + demo.health + '/' + MAX_HEALTH);

            } else {
                setNote('floor ' + demo.floor + '  •  blood ' + demo.health + '/' +
                        MAX_HEALTH + '  •  ' + demo.hurts + ' hurt(s)');
            }
        } catch (error) {
            ctx.restore();
            ctx.save();
            clearCanvas(ctx, canvas.width, canvas.height, '#ffffff');
            ctx.fillStyle = '#111111';
            ctx.font = '13px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Waiting for working code…', canvas.width / 2, canvas.height / 2);
            setNote('The demo stopped: ' + error.message);
        }
        ctx.restore();
    }

    /** sizeCanvas — every demo uses the same shrunken shaft. */
    function sizeCanvas(step, canvas) {
        canvas.width = Math.round(FIELD_WIDTH * SCALE);
        canvas.height = Math.round(FIELD_HEIGHT * SCALE);
    }

    /** controls — the buttons under the demo, chosen by the step. */
    function controls(step, addButton) {
        const kind = step.demo.kind;

        if (kind === 'kinds') {
            addButton('↑ Next kind', 'Look at the platform above', function () {
                demo.looking = Math.max(0, (demo.looking || 0) - 1);
            });
            addButton('↓ Next kind', 'Look at the platform below', function () {
                demo.looking = Math.min(demo.platforms.length - 1, (demo.looking || 0) + 1);
            });
            return;
        }

        addButton('←', 'Walk left', function () { demo.steering = -1; });
        addButton('Stop', 'Stop walking', function () { demo.steering = 0; });
        addButton('→', 'Walk right', function () { demo.steering = 1; });
        addButton('↺ New', 'Start again', function () { startDemo(step); });
    }

    /** onKey — only the last step plays with the keyboard. */
    function onKey(step, event) {
        if (demoKind !== 'final' || !demo) { return; }
        const action = actionForKey(event.key);
        if (action === null || action === undefined) { return; }
        event.preventDefault();

        if (action === 'restart') { startDemo(step); }
        else if (action === 'pause') { togglePause(demo); }
        else if (action === 'left') { demo.steering = -1; }
        else if (action === 'right') { demo.steering = 1; }
    }

    startWorkshop({
        storagePrefix: 'floors-build',
        steps: FLOORS_STEPS,
        demo: {
            sizeCanvas: sizeCanvas,
            start: startDemo,
            update: function (step, elapsed) { updateDemo(elapsed); },
            draw: function (step, ctx, canvas, setNote) { drawDemo(ctx, canvas, setNote); },
            controls: controls,
            onKey: onKey
        }
    });
})();
