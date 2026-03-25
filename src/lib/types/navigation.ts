import { type Pathname } from '$app/types';

export interface NavItem {
	href: Pathname;
	label: string;
}
