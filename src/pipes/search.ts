import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FilterCompaniesPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
	name: 'search',
})
export class SearchPipe implements PipeTransform {
	transform(value, keys: string, term: string) {
		if (!term) return value;
		return (value || []).filter((item) => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])));
	}
}
