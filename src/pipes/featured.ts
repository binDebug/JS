import { Injectable, Pipe,PipeTransform } from '@angular/core';

/*
  Generated class for the Featured pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'featured'
})
@Injectable()
export class FeaturedPipe implements PipeTransform {
  /*
    Takes a value and makes it lowercase.
   */
  transform(jobs: any[], filter: Object) {
   if(!jobs || !filter) {
     return jobs;
   }
   
   return jobs.filter(job => (job.featured) && (job.featured == true))
  }
}
