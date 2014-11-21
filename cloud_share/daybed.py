# -*- coding: utf-8 -*-
import json

import requests
from requests.exceptions import HTTPError
from requests_hawk import HawkAuth

from cloud_share import config


class PublicKeyNotFound(Exception):
    pass


class DaybedClient(object):
    def __init__(self, host=None):
        if host is None:
            host = config['daybed_server']

        self.host = host.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'Content-type': 'application/json',
            'Accept': 'application/json'})

    @property
    def hawk_id(self):
        return self.session.auth.credentials['id']

    def build_url(self, path):
        return "%s%s" % (self.host, path)

    def load_session_token(self, session_token):
        """
        Load the session token and build the Auth for the requests session.

        """
        hawk_auth = HawkAuth(
            hawk_session=session_token,
            server_url=self.host)
        hawk_id = hawk_auth.credentials["id"]
        self.session.auth = hawk_auth
        return hawk_id

    def create_session_token(self):
        """
        Ask the daybed server for a new session.

        """
        url = self.build_url("/tokens")
        r = self.session.post(url)
        r.raise_for_status()
        session_token = r.json()['token']
        self.load_session_token(session_token)
        return session_token

    def upload_pub_key(self, public_key):
        """Upload a public-key to Daybed.

        :param public_key: The hawk session public_key

        """
        url = self.build_url("/models/%s/records/%s" % (
            config['pubkey_store_model_id'],
            self.hawk_id
        ))
        data = json.dumps({
            "pub": public_key
        })
        r = self.session.put(url, data=data)
        r.raise_for_status()

    def get_public_key(self, identifier):
        """Returns a public key for the given identifier.

        :param identifier: an email address or phone number or hawk id.

        """
        url = self.build_url("/models/%s/records/%s" % (
            config.get("pubkey_store_model_id"),
            identifier))
        r = self.session.get(url)
        try:
            r.raise_for_status()
        except HTTPError:
            raise PublicKeyNotFound(r.json())
        return r.json()['pub']

    def upload_document(self, filename, encrypted_content, participants_keys,
                        doc_id=None):
        """Upload a user document.

        :param filename:          The document filename.
        :param encrypted_content: The document encrypted content
        :param participantKeys:   A Mapping of the document encrypted
                                  key for each participant.

        """
        url = self.build_url("/models/%s/records" % (
            config.get("document_model_id")))

        data = json.dumps({
            "filename": filename,
            "content": encrypted_content,
            "participantsKeys": participants_keys
        })

        if doc_id is None:
            r = self.session.post(url, data=data)
        else:
            url += "/%s" % doc_id
            r = self.session.put(url, data=data)

        try:
            r.raise_for_status()
        except HTTPError:
            print(r.json())
            raise
        return r.json()['id']

    def list_documents(self):
        """List user documents.

        """
        url = self.build_url("/models/%s/records" % (
            config.get("document_model_id")))
        r = self.session.get(url)
        try:
            r.raise_for_status()
        except HTTPError:
            print(r.json())
            raise
        return r.json()['records']
