import { Injectable, ComponentFactoryResolver, Inject, Type, ViewContainerRef, ComponentRef } from '@angular/core';
import { Modal } from './modal';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private modalContainer: ViewContainerRef;

    constructor(@Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver) { }

    setModalContainer(modalContainer: ViewContainerRef): void {
        this.modalContainer = modalContainer;
    }

    openModal<INIT_DATA_TYPE, COMPONENT_TYPE extends Modal<INIT_DATA_TYPE>>(
            componentType: Type<COMPONENT_TYPE>, data?: INIT_DATA_TYPE): ComponentRef<COMPONENT_TYPE> {
        const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        const component = factory.create(this.modalContainer.injector);
        component.instance.setData(data);
        component.instance.close = () => this.closeModal(component);
        this.modalContainer.insert(component.hostView);

        return component;
    }

    closeModal<ComponentType extends Modal<any>>(modalComponent: ComponentRef<ComponentType>): void {
        const index = this.modalContainer.indexOf(modalComponent.hostView);
        if (index >= 0) {
            this.modalContainer.remove(index);
        }
    }
}
