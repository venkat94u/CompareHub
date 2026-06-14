import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
  readonly mode$ = this.theme.mode$;
  backgroundClass = 'bg-home';

  constructor(private readonly theme: ThemeService, private readonly router: Router) {}

  ngOnInit(): void {
    this.setBackground(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.setBackground(event.urlAfterRedirects));
  }

  toggleTheme(): void {
    this.theme.toggle();
  }

  private setBackground(url: string): void {
    if (url.includes('text-compare')) this.backgroundClass = 'bg-text';
    else if (url.includes('json-compare')) this.backgroundClass = 'bg-json';
    else if (url.includes('code-compare')) this.backgroundClass = 'bg-code';
    else this.backgroundClass = 'bg-home';
  }
}
