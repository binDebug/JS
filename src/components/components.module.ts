import { NgModule } from '@angular/core';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs';
import { NotificationsComponent } from './notifications/notifications';
import { ResumeComponent } from './resume/resume';
@NgModule({
	declarations: [AppliedJobsComponent,
    NotificationsComponent,
    ResumeComponent],
	imports: [],
	exports: [AppliedJobsComponent,
    NotificationsComponent,
    ResumeComponent]
})
export class ComponentsModule {}
