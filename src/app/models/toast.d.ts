export interface NewToast
{
	id?: number;
	message: string;
	type: 'error' | 'success' | 'info' | 'warning';
	duration?: number;
}

export interface Toast extends NewToast {
	id: number;
}