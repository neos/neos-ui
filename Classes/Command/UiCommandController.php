<?php

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Command;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Cli\CommandController;
use Neos\Flow\Package\PackageManager;
use Neos\Neos\Ui\Application\Notification\AlertNotification;
use Neos\Neos\Ui\Application\UiApi;
use Neos\Neos\Ui\Application\UiApiManifest;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\TsHeaderComment;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\TsIndexModuleFactory;
use Neos\Utility\Files;

#[Flow\Scope("singleton")]
final class UiCommandController extends CommandController
{
    #[Flow\Inject]
    protected PackageManager $packageManager;

    #[Flow\Inject(lazy: false)]
    protected UiApiManifest $uiApiManifest;

    #[Flow\Inject]
    protected UiApi $uiApi;

    /**
     * @return void
     */
    public function generatePackagesCommand(): void
    {
        $package = $this->packageManager->getPackage('Neos.Neos.Ui');
        $pathToOutputDirectory = Files::concatenatePaths([
            $package->getPackagePath(),
            'packages/neos-ui-api/src/generated'
        ]);

        $tsHeaderComment = new TsHeaderComment(
            packageName: '@neos-project/neos-ui-api',
            packageDescription: 'Neos CMS backend API facade',
            year: (new \DateTimeImmutable())->format('Y')
        );
        $tsIndexModule = TsIndexModuleFactory::forManifest($this->uiApiManifest);

        foreach ($tsIndexModule->dependencies->getRecursiveIterator() as $dependency) {
            $filesToBeWritten[(string) $dependency->path] = $dependency;
        }

        $filesToBeWritten[(string) $tsIndexModule->path] = $tsIndexModule;

        Files::removeDirectoryRecursively($pathToOutputDirectory);
        foreach ($filesToBeWritten as $file) {
            $fileName = Files::concatenatePaths([
                $pathToOutputDirectory,
                $tsIndexModule->path->getRelativePathTo($file->path) . '.ts'
            ]);

            Files::createDirectoryRecursively(dirname($fileName));
            file_put_contents($fileName, $tsHeaderComment->render() . $file->render());
        }
    }
}
