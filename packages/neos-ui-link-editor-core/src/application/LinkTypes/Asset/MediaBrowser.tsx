import * as React from 'react'
import style from './mediaBrowserStyle.module.css'

import {globalRegistry} from '@neos-project/neos-ui/globalRegistry'

interface Props {
	assetIdentifier: null | string
	onSelectAsset: (assetIdentifier: string) => void
}

export const MediaBrowser: React.FC<Props> = (props) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const selectionRef = React.useRef<HTMLElement>(null)

    const secondaryEditorsRegistry = globalRegistry?.get('inspector')?.get('secondaryEditors') as {
		get: (identifier: string) => {
			component: React.ComponentType<any>
		}
	}
    const {component: MediaSelectionScreenComponent} = secondaryEditorsRegistry?.get(
		'Neos.Neos/Inspector/Secondary/Editors/MediaSelectionScreen'
	)

	// The standard MediaBrowser of Neos uses an iframe and requires some styles to be applied to the iframe content
    const iframe = containerRef.current?.querySelector('& > iframe') as HTMLIFrameElement

    React.useEffect(() => {
        const handleIframeLoad = (ev: Event) => {
            const iframeDocument = (ev.target as HTMLIFrameElement).contentDocument
            if (iframeDocument) {
                iframeDocument.body.style.overflowX = 'hidden'
                iframeDocument.body.style.padding = '0'
                iframeDocument.querySelector('form > .neos-footer')?.remove()
                iframeDocument.querySelectorAll('input, select, textarea')?.forEach((input) => {
                    (input as HTMLInputElement).readOnly = true
                })
            }
        }

        iframe?.addEventListener('load', handleIframeLoad)

        return () => {
            iframe?.removeEventListener('load', handleIframeLoad)
        }
    }, [iframe])

    return (
        <div className={style.container} ref={containerRef}>
            <MediaSelectionScreenComponent
                ref={selectionRef}
                assetIdentifier={props.assetIdentifier}
                onComplete={props.onSelectAsset}
                constraints={{mediaTypes: []}}
			/>
        </div>
    )
}
