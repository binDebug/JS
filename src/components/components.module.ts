import { NgModule } from '@angular/core';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs';
import { NotificationsComponent } from './notifications/notifications';
@NgModule({
	declarations: [AppliedJobsComponent,
    NotificationsComponent],
	imports: [],
	exports: [AppliedJobsComponent,
    NotificationsComponent]
})
export class ComponentsModule {}
