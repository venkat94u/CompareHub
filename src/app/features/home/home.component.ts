import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tools = [
    { title: 'Text Compare', path: '/text-compare', body: 'Spot line changes in plain text with side-by-side and inline views.' },
    { title: 'JSON Compare', path: '/json-compare', body: 'Validate, format and compare JSON without uploading sensitive payloads.' },
    { title: 'Code Compare', path: '/code-compare', body: 'Review TypeScript, JavaScript, HTML, CSS, Java and Python diffs locally.' }
  ];
  trust = ['Browser Based', 'No Uploads', 'No Login', 'No Data Storage', 'Works Locally'];
  benefits = ['Free Forever', 'Instant Results', 'Secure', 'Fast'];
  faqs = [
    ['Does CompareHub upload my data?', 'No. Comparisons run entirely in your browser.'],
    ['Do I need an account?', 'No login, signup or authentication is required.'],
    ['Can I use it on mobile?', 'Yes. The editor and results adapt to phones, tablets and desktop screens.']
  ];

  constructor(private readonly seo: SeoService) {}

  ngOnInit(): void {
    this.seo.set(
      'CompareHub | Fast Privacy-First Compare Tool',
      'Compare Text, JSON and Source Code instantly with no login, no uploads and no data leaving your browser.'
    );
  }
}
