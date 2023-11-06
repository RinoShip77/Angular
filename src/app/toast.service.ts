import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
	toasts: any[] = [];

	show(text: string, options: any = {}) {
		this.toasts.push({ text, ...options });
		localStorage.removeItem('notification');
		localStorage.setItem('notification', text);
	}

	remove(toast: any) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}