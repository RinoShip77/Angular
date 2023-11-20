import { Component, TemplateRef } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
	selector: 'app-toast',
	template: `
	<div class="mt-5">
		<ngb-toast
		*ngFor="let toast of toastService.toasts"
		class="w-75 mx-auto my-3 px-3 text-white text-nowrap text-center fs-3"
		[class]="toast.classname"
		[autohide]="true"
		[delay]="toast.delay || 5000"
		[animation]="true"
		(hidden)="toastService.remove(toast)"
		>
			<ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
				<ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
			</ng-template>
			
			<ng-template #text>{{ toast.textOrTpl }}</ng-template>
		</ngb-toast>
	</div>`
})
export class ToastComponent {
	constructor(public toastService: ToastService) { }

	isTemplate(toast: { textOrTpl: any; }) {
		return toast.textOrTpl instanceof TemplateRef;
	}
}