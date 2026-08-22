<script>
    // get current week days from indexdb
    // figure out current day and highlight it


    // dummy data for testing
    let records = {
        Dates: [
            "2023-09-01",
            "2023-09-02",
            "2023-09-03",
            "2023-09-04",
            "2023-09-05",
            "2023-09-06",
            "2023-09-07",
        ],
    };

    // function strip day num from date string
    function getDayNumer(dateString) {
        const date = new Date(dateString);
        return date.getDate();
    }

    // function get if its mon, tue, wed, thu, fri, sat, sun
    function getDayName(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { weekday: "short" });
    }
</script>

<section class="weekBar">
{#each records.Dates as day}
    <button class="day">
        <span class="dayName">{getDayName(day)}</span>
        <span class="dayNum">{getDayNumer(day)}</span>
    </button>
{/each}

</section>

<style>
    .weekBar {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.5rem;
    }

    .day {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        background: var(--background-color);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        padding: 0.5rem;
        border-radius: 0.25rem;
        cursor: pointer;
    }

    .dayName {
        display: block;
        font-weight: bold;
        text-transform: uppercase;
    }

    .dayNum {
        display: grid;
        place-items: center;
        font-size: 0.875rem;
        background: red;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
    }
</style>