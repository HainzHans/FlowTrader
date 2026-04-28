import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ghost-button',
  imports: [],
  templateUrl: './ghost-button.html',
  styleUrl: './ghost-button.css',
})
export class GhostButton {

  constructor(private router: Router) {
  }

  navigateTo() {
    this.router.navigate(['/auth']);
  }

}
