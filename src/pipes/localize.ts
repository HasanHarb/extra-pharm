import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
	name: 'localize'
})
export class LocalizePipe implements PipeTransform {
	constructor(public translate: TranslateService) { }
	transform(item: any, field: string, take: number = 0): string {

		if (item.translations == null || localStorage.selectedLang == 'ar') {
			return take > 0 ? item[field].substring(0, take) : item[field];
		}

		let translation = item.translations.filter(x => x.column_name == field && x.locale == this.translate.defaultLang || this.translate.currentLang)[0];
		let value = translation && translation.value != "" ? translation.value : item[field];
		if (take > 0) {
			return value.substring(0, take);
		}
		return value;
	}
}
