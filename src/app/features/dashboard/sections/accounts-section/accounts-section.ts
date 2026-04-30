import { Component } from '@angular/core';
import {SectionHeader} from "../../components/section-header/section-header";

@Component({
  selector: 'app-accounts-section',
    imports: [
        SectionHeader
    ],
  templateUrl: './accounts-section.html',
  styleUrl: './accounts-section.css',
})
export class AccountsSection {}
