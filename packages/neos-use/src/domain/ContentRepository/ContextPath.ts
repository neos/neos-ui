import * as React from 'react';
import {Any} from 'ts-toolbelt';

import {useSelector} from '../Extensibility/Store';

export type Path = Any.Type<string, 'NodePath'>;
export type Context = Any.Type<string, 'ContentContext'>;

export class ContextPath {
    private constructor(
        public readonly path: Path,
        public readonly context: Context
    ) { }

    public static fromString(string: string): null | ContextPath {
        const [path, context] = (string ?? '').split('@');

        if (path && string) {
            return new ContextPath(path as Path, context as Context);
        }

        return null;
    }

    public adopt(pathLike: undefined | null | string): null | ContextPath {
        const [path] = (pathLike ?? '').split('@');

        if (path) {
            return new ContextPath(path as Path, this.context);
        }

        return null;
    }

    public getIntermediateContextPaths(other: ContextPath): ContextPath[] {
        if (other.path.startsWith(this.path)) {
            const segments = other.path.split('/');
            const result: ContextPath[] = [];

            for (const [index] of segments.entries()) {
                const path = segments.slice(0, -index).join('/');
                if (path) {
                    result.push(new ContextPath(path as Path, this.context));
                }

                if (path === this.path) {
                    break;
                }
            }

            return result;
        }

        return [];
    }

    public equals(other: ContextPath): boolean {
        return this.path === other.path && this.context === other.context;
    }

    public toString(): string {
        return `${this.path}@${this.context}`;
    }

    get depth(): number {
        return this.path.match(/\//g)?.length ?? 0;
    }
}

export function useSiteNodeContextPath(): null | ContextPath {
    const siteNodeContextPath = useSelector(state => state.cr?.nodes?.siteNode);
    const result = React.useMemo(() => {
        if (siteNodeContextPath) {
            return ContextPath.fromString(siteNodeContextPath);
        }

        return null;
    }, [siteNodeContextPath]);

    return result;
}

export function useDocumentNodeContextPath(): null | ContextPath {
    const documentNodeContextPath = useSelector(state => state.cr?.nodes?.documentNode);
    const result = React.useMemo(() => {
        if (documentNodeContextPath) {
            return ContextPath.fromString(documentNodeContextPath);
        }

        return null;
    }, [documentNodeContextPath]);

    return result;
}
