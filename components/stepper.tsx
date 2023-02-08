import { useState } from 'react';
import clsx from 'clsx';

export default function Stepper({ steps }) {
    const [currentStep, setCurrentStep] = useState(1);
    const Component = steps[currentStep-1]?.component;
    return (
        <div>
            <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
            {
                steps.map( ({ title, description, component }, idx) => {
                    return (
                        <li className={clsx("flex items-center space-x-2.5", { 'text-blue-600 dark:text-blue-500': idx+1 === currentStep })} key={idx}>
                            <span className="flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">{ idx + 1 }</span>
                            <span>
                                <h3 className="font-medium leading-tight">{ title }</h3>
                                <p className="text-sm">{ description }</p>
                            </span>
                        </li>
                    )
                })
            }
            </ol>
            <div>
                { Component && <Component /> }
                <button onClick={ () => setCurrentStep((current) => current+1) }>
                    Next
                </button>
            </div>
        </div>
    )
}