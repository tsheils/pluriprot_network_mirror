import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class IconService {
  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
<<<<<<< HEAD
  }

  // todo: use environment variable

  init() {
    this.matIconRegistry.addSvgIcon(
      "search",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/icons/ic_search_24px.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "open_in_new",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/icons/ic_open_in_new_24px.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "close",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/icons/baseline-close-24px.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "arrow_left",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/icons/baseline-arrow_left-24px.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "arrow_right",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/icons/baseline-arrow_right-24px.svg")
    );
this.matIconRegistry.addSvgIcon(
      "reset_zoom",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/icons/baseline-find_replace-24px.svg")
    );
this.matIconRegistry.addSvgIcon(
      "refresh",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/icons/baseline-refresh-24px.svg")
=======
    console.log("sonstdsfsdf");
  }

  init() {
    console.log(this);
    this.matIconRegistry.addSvgIcon(
      "search",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../assets/icons/ic_search_24px.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "open_in_new",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../assets/icons/ic_open_in_new_24px.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "close",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../assets/icons/baseline-close-24px.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "arrow_left",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../assets/icons/baseline-arrow_left-24px.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "arrow_right",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../assets/icons/baseline-arrow_right-24px.svg")
>>>>>>> 203407fc605741f942d01fa2afc5855fe978a973
    );

  }
}
