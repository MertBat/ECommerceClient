import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { BaseComponent } from 'src/app/base/base.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicLoadComponentService {
  //ViewContainerRef : Dinamik olarak yüklenecek componenti içerisinde barındır.(Her dinamik yüklemede önceki vire'ler clear edilmeli)
  //ComponentFactory : Componentlerin instancesini oluşturmak için kullanılan bir nesnedir.
  //ComponentFactoryResolver : Belirli bir component için ComponentFactory'i resolve edern sınıftır. İçerisinde resolvefactory aracılığı ile ilgili component a dair bir componentfactory nesnesi oluşturup döner.

  constructor(private componentFactoryResolver:ComponentFactoryResolver) { }

  async loadComponent(componentName: ComponentName, viewContainerRef : ViewContainerRef){
    let component: any = null;

    switch(componentName){
      case ComponentName.BasketsComponent:
      component = (await import("../../ui/components/baskets/baskets.component")).BasketsComponent;
      break;
    }

    viewContainerRef.clear();
    return viewContainerRef.createComponent(this.componentFactoryResolver.resolveComponentFactory(component))
  }
}

export enum ComponentName{
  BasketsComponent
}
