import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { ProductService } from 'src/app/services/common/models/product.service';

declare var $:any

@Directive({
  selector: '[appDelete]',
})
export class DeleteDirective {
  constructor(
    private element: ElementRef,
    private _render: Renderer2,
    private productService: ProductService,
    private spinner:NgxSpinnerService
  ) {

    const img = _render.createElement("img");
    img.setAttribute("src", "/src/assets/delete.png")
    img.setAttribute("style", "cursor: pointer;");
    img.width = 25;
    img.height = 25;
    _render.appendChild(element.nativeElement, img);
  }

  @Input() id:string;
  @Output() callBack : EventEmitter<any> = new EventEmitter();

  @HostListener("click")
  onclick(){
    this.spinner.getSpinner(SpinnerType.BallAtom);
    const td: HTMLTableColElement = this.element.nativeElement;
    this.productService.delete(this.id)
    $(td.parentElement).fadeOut(2000, ()=>{
      this.callBack.emit;
    });
  }
}
