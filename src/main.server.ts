import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { provideServerRendering } from '@angular/platform-server';
import { mergeApplicationConfig } from '@angular/core';

const serverConfig = mergeApplicationConfig(appConfig, {
  providers: [provideServerRendering()],
});

const bootstrap = () => bootstrapApplication(AppComponent, serverConfig);
export default bootstrap;
