import * as React from 'react'
import { useEffect, useRef } from 'react'

import { useGlobalRegistry } from '@neos-project/neos-ui-link-editor-neos-bridge'
import styled from 'styled-components'

interface Props {
	assetIdentifier: null | string
	onSelectAsset: (assetIdentifier: string) => void
}

const Container = styled.div`
	width: calc(-80px - 64px + 100vw);
	max-width: 1260px;

	& > div {
		padding: 0;
	}

	& > iframe {
		width: calc(100vw - 160px);
		max-width: 100%;
		height: calc(100vh - 580px);
		position: relative;
	}
`

export const MediaBrowser: React.FC<Props> = (props) => {
	const globalRegistry = useGlobalRegistry()
	const containerRef = useRef<HTMLDivElement>(null)
	const selectionRef = useRef<HTMLElement>(null)

	const secondaryEditorsRegistry = globalRegistry?.get('inspector')?.get('secondaryEditors') as {
		get: (identifier: string) => {
			component: React.ComponentType<any>
		}
	}
	const { component: MediaSelectionScreenComponent } = secondaryEditorsRegistry?.get(
		'Neos.Neos/Inspector/Secondary/Editors/MediaSelectionScreen'
	)

	// The standard MediaBrowser of Neos uses an iframe and requires some styles to be applied to the iframe content
	const iframe = containerRef.current?.querySelector('& > iframe') as HTMLIFrameElement

	useEffect(() => {
		const handleIframeLoad = (ev: Event) => {
			const iframeDocument = (ev.target as HTMLIFrameElement).contentDocument
			if (iframeDocument) {
				iframeDocument.body.style.overflowX = 'hidden'
				iframeDocument.body.style.padding = '0'
				iframeDocument.querySelector('form > .neos-footer')?.remove()
				iframeDocument.querySelectorAll('input, select, textarea')?.forEach((input) => {
					;(input as HTMLInputElement).readOnly = true
				})
			}
		}

		iframe?.addEventListener('load', handleIframeLoad)

		return () => {
			iframe?.removeEventListener('load', handleIframeLoad)
		}
	}, [iframe])

	return (
		<Container ref={containerRef}>
			<MediaSelectionScreenComponent
				ref={selectionRef}
				assetIdentifier={props.assetIdentifier}
				onComplete={props.onSelectAsset}
				constraints={{ mediaTypes: [] }}
			/>
		</Container>
	)
}
