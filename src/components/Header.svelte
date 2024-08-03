<script>
    export let diffultity
    $: console.log(diffultity)
</script>

<div class="websiteHeader">
    <svg class="logo" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1431_405)">
        <rect x="19.2158" y="22.022" width="16" height="16" rx="4" transform="rotate(-15 19.2158 22.022)" fill="#6ACBBA"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.15232 9.24264C2.90968 11.395 3.64173 14.127 5.10583 19.5911L6.91756 26.3526C8.38166 31.8167 9.11371 34.5487 11.266 35.7914C12.9769 36.7791 15.0541 36.5192 18.5785 35.6357C19.6089 35.3774 20.1241 35.2482 20.3358 34.8792C20.5474 34.5103 20.3879 33.9627 20.0687 32.8675C19.8516 32.1222 19.6214 31.2634 19.3545 30.2671C18.3869 26.656 17.9031 24.8504 18.3192 23.2975C18.5918 22.2802 19.1274 21.3525 19.8721 20.6078C21.0089 19.471 22.8145 18.9872 26.4255 18.0196C27.4227 17.7524 28.2822 17.5221 29.0367 17.3375C30.1378 17.068 30.6884 16.9333 30.9026 16.5713C31.1169 16.2094 30.9787 15.6937 30.7023 14.6622L30.2199 12.8618C28.7558 7.39771 28.0237 4.66566 25.8714 3.42302C23.7191 2.18038 20.9871 2.91243 15.523 4.37653L13.5911 4.89417C8.12701 6.35827 5.39496 7.09032 4.15232 9.24264Z" fill="url(#paint0_linear_1431_405)"/>
        </g>
        <defs>
        <linearGradient id="paint0_linear_1431_405" x1="13.8408" y1="4.19445" x2="23.4712" y2="36.4625" gradientUnits="userSpaceOnUse">
        <stop/>
        <stop offset="1" stop-color="#6D8295"/>
        </linearGradient>
        <clipPath id="clip0_1431_405">
        <rect width="40" height="40" fill="white"/>
        </clipPath>
        </defs>
        </svg>
        
        
        
        
    <h1>CrossChroma</h1>
    <div class="row">
        <span>Size</span>
        <div class="selectorContainer">
        <select name="" id="" bind:value={diffultity}>
            <option value="any">any</option>
            <option value="easy">mini</option>
            <option value="medium">small</option>
            <option value="hard">medium</option>
        </select>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5L8 9L12 5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
            
    </div>
    <div class="description">
        <p>
            Casual puzzle about color and perception.
        </p>
        <p>
            Tap to sort and arrange colored tiles into perfectly ordered mosaics.
        </p>
    </div>
</div>

<style>

    select {
            all: unset;
        }

    .logo {
        display: none;
        margin-bottom: 1rem;
    }
    .websiteHeader {
        display: inline-block;
        
    }

    h1 {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 4px 0;
    }
    .description {

        width: 100%;
        margin-top: 1.5rem;
        opacity: 0;
        display: none;

    }
    .description p {
        margin: 0 0 8px 0;
        max-width: 40ch;
        font-size: 16px;
        line-height: 1.4;
    }
    .description p:last-child {
        margin-bottom: 0;
    }

    .row {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .selectorContainer {
        display: flex;
        align-items: baseline;
        gap: 8px;
        padding: 4px 8px;
        border-radius: 3px;
        width: min-content;
        margin-left: -8px;
    }
    .selectorContainer:hover {
        background-color: var(--neutral-200);
    }

    @media screen and (min-width: 750px) {
        .logo {
                display: block;
            }
        .websiteHeader {
                display: block;
                grid-column: 1/-1;
                margin-bottom: 1rem;
                margin-right: auto;
            }
            p {
                font-size: 24px;
                margin: 1rem 0 4px 0;
                color: var(--textSecondary);
            }
            .description {
                opacity: 1;
                display: block;
            }
    }


    /* media at 900 from the start */
    @media screen and (min-width: 900px) {
            .logo {
                display: block;
            }

            .websiteHeader {
                display: block;
                grid-column: 1/-1;
                margin-bottom: 1rem;
                margin-right: auto;
            }
            p {
                font-size: 24px;
                margin: 1rem 0 4px 0;
            }
            
    }


</style>