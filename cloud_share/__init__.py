#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pkg_resources

#: Module version, as defined in PEP-0396.
__version__ = pkg_resources.get_distribution(__package__).version

config = {
    "pubkey_store_model_id": "daybed:cloud-share:pubkey-store",
    "document_model_id": "daybed:cloud-share:document",
    "daybed_server": "http://localhost:8000/v1"
}
