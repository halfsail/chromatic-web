<script>
    import { version } from "$app/environment";
    import WeekStreak from "./WeekStreak.svelte";
    import PillBtn from "../buttons/PillBtn.svelte"
    import { randomPlayLevel } from "$lib/state/Store.svelte";
    import { closeMenu } from "$lib/state/InterfaceState.svelte";

    function playRandomLevel() {
        randomPlayLevel();
        closeMenu("sidebar");
    }
</script>

<section>
    <img class="icon" src="./favicon.png" alt="" />

    <div class="aboutText">
        <h2>Chromatic</h2>
        <p>A casual relaxing puzzle game. Where you sort color and create gradients.</p>
    </div>

    <WeekStreak />
    <PillBtn onclick={playRandomLevel} label="Play Random Level" />

    <div class="footer">
        <p>version {version}</p>
        <p>
            <span>Game by</span>
            <a href="https://feyder.co">Feyder.co</a>
        </p>
    </div>
</section>

<style>

    section {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
    }

    .aboutText {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 8px;

        h2 {
            margin: 0;
            font-size: var(--font-2xl);
        }
        p {
            text-align: pretty;
            padding: 0 8px;
            /*color: light-dark(var(--grey-6), var(--grey-4));*/
        }

    }

    .icon {
        width: 64px;
        height: 64px;
        border-radius: 2rem;
        corner-shape: squircle;
        margin-top: 24px;
    }

    .footer {
        display: flex;
        gap: 16px;
        align-items: center;
        font-size: var(--font-sm);
        color: var(--text-color-third);
        margin-top: 8px;

        p {
            font-size: inherit;
            color: inherit;
        }
        a {
            color: currentColor;
        }
    }




</style>
