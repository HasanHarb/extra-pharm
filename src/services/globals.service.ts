import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class Globals {
    constructor(private translationService: TranslateService, 		
        private toastr: ToastrService) {}

    translatefn(key): string {
        var x = "";
        this.translationService.get(key).subscribe(t => {
            x = t;
        });
        return x;
    }

    successAlert(title, body)
    {
        this.toastr.success(this.translatefn(title) + '!', this.translatefn(body));
    }

    warningAlert(title, body)
    {
        this.toastr.warning(this.translatefn(title) + '!', this.translatefn(body));
    }

    errorAlert(title, body)
    {
        this.toastr.error(this.translatefn(title) + '!', this.translatefn(body));
    }
}