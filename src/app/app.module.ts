import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';


import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

// import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup/src/datetime-popup.module';

import { DateTimePickerModule } from 'ngx-datetime-picker';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsModule, ProgressbarModule, ModalModule, BsDropdownModule } from 'ngx-bootstrap';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Layout
import { LayoutComponent } from './layout/layout.component';
import { PreloaderDirective } from './layout/preloader.directive';
// Header
import { AppHeaderComponent } from './layout/header/header.component';
// Sidenav
import { AppSidenavComponent } from './layout/sidenav/sidenav.component';
import { ToggleOffcanvasNavDirective } from './layout/sidenav/toggle-offcanvas-nav.directive';
import { AutoCloseMobileNavDirective } from './layout/sidenav/auto-close-mobile-nav.directive';
import { AppSidenavMenuComponent } from './layout/sidenav/sidenav-menu/sidenav-menu.component';
import { AccordionNavDirective } from './layout/sidenav/sidenav-menu/accordion-nav.directive';
import { AppendSubmenuIconDirective } from './layout/sidenav/sidenav-menu/append-submenu-icon.directive';
import { HighlightActiveItemsDirective } from './layout/sidenav/sidenav-menu/highlight-active-items.directive';
// Customizer
import { AppCustomizerComponent } from './layout/customizer/customizer.component';
import { ToggleQuickviewDirective } from './layout/customizer/toggle-quickview.directive';
// Footer
import { AppFooterComponent } from './layout/footer/footer.component';
// Search Overaly
import { AppSearchOverlayComponent } from './layout/search-overlay/search-overlay.component';
import { SearchOverlayDirective } from './layout/search-overlay/search-overlay.directive';
import { OpenSearchOverlaylDirective } from './layout/search-overlay/open-search-overlay.directive';

// Pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageLayoutFullscreenComponent } from './page-layouts/fullscreen/fullscreen.component';

//Extra Pages
// import { PageLoginComponent } from './extra-pages/login/login.component';

import { ExtraPagesModule } from './extra-pages/extra-pages.module';

// Sub modules
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';

// hmr
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

import { PipesModule } from './pipes/pipes.module';

import { ServicesUtilityService } from './_services/services-utility.service';
import { ApiRequestService } from './_services/api-request-utitlity/api-request.service';
import { HelpSupportComponent } from './help-support/help-support.component';
import { HelpSupportModule } from './help-support/help-support.module';

@NgModule({
    providers: [ServicesUtilityService, ApiRequestService],
    imports: [
        NgbModule.forRoot(),
        TabsModule.forRoot(),
        ProgressbarModule.forRoot(),
        ModalModule.forRoot(),
        BsDropdownModule.forRoot(),
        AngularFontAwesomeModule,
        DateTimePickerModule,
        BrowserModule,
        HttpModule,
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        AppRoutingModule,

        // Sub modules
        LayoutModule,
        SharedModule,
        PipesModule,
        ExtraPagesModule,
        HelpSupportModule
    ],
    declarations: [
        AppComponent,
        // Layout
        LayoutComponent,
        PreloaderDirective,
        // Header
        AppHeaderComponent,
        // Sidenav
        AppSidenavComponent,
        ToggleOffcanvasNavDirective,
        AutoCloseMobileNavDirective,
        AppSidenavMenuComponent,
        AccordionNavDirective,
        AppendSubmenuIconDirective,
        HighlightActiveItemsDirective,
        // Customizer
        AppCustomizerComponent,
        ToggleQuickviewDirective,
        // Footer
        AppFooterComponent,
        // Search overlay
        AppSearchOverlayComponent,
        SearchOverlayDirective,
        OpenSearchOverlaylDirective,
        //
        // PageLoginComponent,
        DashboardComponent,
        // Pages
        PageLayoutFullscreenComponent,
        HelpSupportComponent,
        // TicketDashboardComponent,
        // EngineerDashboardComponent,
        // TicketGraphViewComponent,
        // EngineerGraphViewComponent
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor(public appRef: ApplicationRef) { }
    hmrOnInit(store) {
        console.log('HMR store', store);
    }
    hmrOnDestroy(store) {
        const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // remove styles
        removeNgStyles();
    }
    hmrAfterDestroy(store) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}
