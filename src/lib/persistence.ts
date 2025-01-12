import { persisted } from 'svelte-persisted-store';

export interface PlayerPreference {
	id: string;
	name: string;
	reading: string;
}

export const playerPreference = persisted('playerPreference', {
	id: '',
	name: '',
	reading: ''
} satisfies PlayerPreference);
