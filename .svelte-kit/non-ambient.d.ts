
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/dev";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/dev": Record<string, never>
		};
		Pathname(): "/" | "/dev" | "/dev/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/audio/.DS_Store" | "/audio/correct_spot.mp3" | "/audio/correct_spot.opus" | "/audio/kirakira.mp3" | "/audio/lock.mp3" | "/audio/lock.ogg" | "/audio/lock_48k.mp3" | "/audio/lock_48k.ogg" | "/audio/pop_down.mp3" | "/favicon.png" | "/favicon_32.png" | "/icons/.DS_Store" | "/icons/chromatic_app_128.png" | "/icons/chromatic_app_144.png" | "/icons/chromatic_app_152.png" | "/icons/chromatic_app_192.png" | "/icons/chromatic_app_512.png" | "/icons/chromatic_app_72.png" | "/icons/chromatic_app_96.png" | "/icons/favicon_16.png" | "/icons/favicon_32.png" | "/icons/ogImage.png" | "/manifest.json" | string & {};
	}
}