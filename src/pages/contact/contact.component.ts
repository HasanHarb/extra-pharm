import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ContactUsData } from '../../models/models';
import { Repo } from '../../services/repo.service';
import { Config } from '../../config';
import { CustomValidators } from 'ng2-validation';
import { Globals } from '../../services/globals.service';

@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

	item: ContactUsData = <ContactUsData>{};
	contactForm: FormGroup;
	errorArray: string[] = [];
	flag = true;
	busy : any;
	settings : any;

	constructor(
		private repo: Repo,
		private globals: Globals,
		private formBuilder: FormBuilder) {
	}

	ngOnInit() {
		this.contactForm = this.formBuilder.group({
			name: ['', [Validators.required, Validators.minLength(3)]],
			phone_number: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.minLength(9)]],
			subject: ['', [Validators.required, Validators.minLength(3)]],
			message: ['', [Validators.required, Validators.minLength(5)]]
		});

		this.busy = this.repo.getSettings().subscribe(data => {
			this.settings = data;
		});
	}
	sendMessage() {
		this.flag = true;
		this.errorArray = [];
		if (this.contactForm.controls['name'].invalid) {
			this.errorArray.push('CONTACT_NAME_REQUIRED');
			this.globals.errorAlert('ERROR', 'FULLNAME_REQUIRED');
			this.flag = false;
		}
		if (this.contactForm.controls['phone_number'].invalid) {
			this.errorArray.push('CONTACT_PHONE_NUMBER_REQUIRED');
			this.flag = false;
		}
		if (this.contactForm.controls['subject'].invalid) {
			this.errorArray.push('CONTACT_SUBJECT_REQUIRED');
			this.flag = false;
		}
		if (this.contactForm.controls['message'].invalid) {
			this.errorArray.push('CONTACT_MESSAGE_REQUIRED');
			this.flag = false;
		}
		console.log(this.contactForm.value);
		if(this.flag)
		{
			this.busy = this.repo.postContactUsMessage(this.contactForm.value).subscribe(data => {
				if (data.id != null) {
					console.log(data);
					this.contactForm.reset();
					this.globals.successAlert('DONE', 'SUCCEED');
				}
			});
		}
		
	}
}
