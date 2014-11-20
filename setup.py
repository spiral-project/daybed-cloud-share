import os
from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))

with open(os.path.join(here, 'README.rst')) as f:
    README = f.read()


setup(name='daybed-cloud-share',
      version="0.1-dev",
      description='Share encrypted document',
      long_description=README,
      classifiers=[
          "Programming Language :: Python",
      ],
      keywords="sodium document cloud encryption",
      author="Mozilla (https://mozilla.org/)",
      url='https://github.com/spiral-project/daybed-cloud-share',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      install_requires=['docopt', 'requests', 'requests-hawk', 'pynacl'],
      entry_points={
          'console_scripts': [
              'cloud-share = cloud_share.cli:main',
          ]})
