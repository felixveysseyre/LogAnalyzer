<?php

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = array(

			/* Internal bundles */

            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
			new Symfony\Bundle\MonologBundle\MonologBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle(),
			new Doctrine\Bundle\MongoDBBundle\DoctrineMongoDBBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),

			/* Unused internal bundles */

			//new Symfony\Bundle\SecurityBundle\SecurityBundle(),
			//new Symfony\Bundle\AsseticBundle\AsseticBundle(),
			//new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),

			/* Custom bundles */

            new LogAnalyzer\CoreBundle\LogAnalyzerCoreBundle(),
        );

        if (in_array($this->getEnvironment(), array('dev', 'test'))) {
            $bundles[] = new Symfony\Bundle\DebugBundle\DebugBundle();
            $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
        }

        return $bundles;
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader->load($this->getRootDir().'/config/config_'.$this->getEnvironment().'.yml');
    }
}
