#!/usr/bin/python
"""
Upload a file for the current user.

"""
from __future__ import unicode_literals, print_function
import json
import os
import sys
import time

from .crypto import (
    generate_keypair, load_keypair, encrypt_key, encrypt_message, HexEncoder,
    decrypt_message, decrypt_key
)
from .daybed import DaybedClient

KEY_FILE = "~/.daybed-cloud-share.key"


def load_config(daybed, key_filepath):
    session_token = None
    private_key = None

    # Try to load the Hawk-Session-Token and User Key
    if os.path.exists(key_filepath):
        with open(key_filepath, "r") as f:
            try:
                content = json.loads(f.read().strip())
            except ValueError:
                pass
            else:
                private_key, public_key = load_keypair(content['user_key'])
                session_token = content['hawk_token']
                daybed.load_session_token(session_token)

    if session_token is None or private_key is None:
        private_key, public_key = generate_keypair()
        session_token = daybed.create_session_token()
        with open(key_filepath, "w") as f:
            f.write("%s" % json.dumps({
                "user_key": private_key.encode(HexEncoder),
                "hawk_token": session_token
            }))

    # Upload the pub key or make sure it exists
    daybed.upload_pub_key(public_key.encode(HexEncoder))

    print("Your HawkId is: %s" % daybed.hawk_id)
    return private_key, public_key, session_token


def upload():
    """
    Upload a document.

    """
    key_filepath = os.path.expanduser(KEY_FILE)
    daybed = DaybedClient()
    private_key, public_key, session_token = load_config(daybed, key_filepath)

    # 4. Encrypt the Document with the document key
    content = None
    if len(sys.argv) > 1:
        with open(sys.argv[1], "r") as f:
            filename = os.path.basename(sys.argv[1])
            content = f.read()
    else:
        filename = "file_%s" % time.time()
        content = sys.stdin.read()

    message_key, encrypted_message = encrypt_message(content)

    # 5. Encrypt the document key with the user key
    encrypted_key = encrypt_key(message_key, public_key.encode(HexEncoder))

    # 6. Upload the document
    doc_id = daybed.upload_document(filename, encrypted_message,
                                    {daybed.hawk_id: encrypted_key})
    # 7. Return the document id.
    print("%s has been created." % doc_id)


def get_documents():
    """
    Retrieve all documents for the session

    """
    key_filepath = os.path.expanduser(KEY_FILE)
    daybed = DaybedClient()
    private_key, public_key, _ = load_config(daybed, key_filepath)

    documents = daybed.list_documents()
    return documents, private_key, public_key, daybed


def list():
    documents, _, _, _ = get_documents()
    for key, value in ((d['id'], d['filename']) for d in documents):
        print("- %s: %s" % (key, value))


def download():
    if len(sys.argv) == 1:
        print("USAGE: %s docId" % sys.argv[0])
        sys.exit(1)

    documents, private_key, public_key, daybed = get_documents()
    docs = dict(((d['id'], d) for d in documents))

    doc_id = sys.argv[1]
    if doc_id not in docs.keys():
        print("%s not found in %s" % (doc_id, docs.keys()))
        sys.exit(2)

    doc = docs[doc_id]
    hawk_id = daybed.hawk_id
    filename = doc['filename']
    params = {
        "encrypted_message": doc['content'],
        "encrypted_key": doc['participantsKeys'][hawk_id]['encrypted_key'],
        "temp_public_key": doc['participantsKeys'][hawk_id]['temp_public_key'],
        "private_key": private_key
    }
    content = decrypt_message(**params)
    output_path = "/tmp/%s" % filename
    with open(output_path, "w") as f:
        f.write(content)
    print("%s has been downloaded at %s" % (doc_id, output_path))


def delete():
    if len(sys.argv) != 2:
        print("USAGE: %s docId" % sys.argv[0])
        sys.exit(1)

    doc_id = sys.argv[1]

    key_filepath = os.path.expanduser(KEY_FILE)
    daybed = DaybedClient()
    private_key, public_key, _ = load_config(daybed, key_filepath)

    daybed.delete_document(doc_id)
    print("%s has been removed." % doc_id)


def share():
    if len(sys.argv) != 3:
        print("USAGE: %s docId newParticipantHawkId" % sys.argv[0])
        sys.exit(1)

    doc_id = sys.argv[1]
    new_hawk_id = sys.argv[2]

    documents, private_key, public_key, daybed = get_documents()
    docs = dict(((d['id'], d) for d in documents))
    if doc_id not in docs.keys():
        print("%s not found in %s" % (doc_id, docs.keys()))
        sys.exit(2)

    doc = docs[doc_id]
    hawk_id = daybed.hawk_id
    params = {
        "encrypted_key": doc['participantsKeys'][hawk_id]['encrypted_key'],
        "temp_public_key": doc['participantsKeys'][hawk_id]['temp_public_key'],
        "private_key": private_key
    }

    new_participant_pub_key = daybed.get_public_key(new_hawk_id)

    message_key = decrypt_key(**params)
    new_participant_key = encrypt_key(message_key, new_participant_pub_key)

    doc['participantsKeys'][new_hawk_id] = new_participant_key
    daybed.update_participant_keys(doc_id, doc['participantsKeys'])
    daybed.add_author_to_document(new_hawk_id, doc_id)
    print("%s: %s has been shared with %s" % (doc['id'], doc['filename'],
                                              new_hawk_id))


def unshare():
    if len(sys.argv) != 3:
        print("USAGE: %s docId participantId" % sys.argv[0])
        sys.exit(1)

    doc_id = sys.argv[1]
    hawk_id = sys.argv[2]

    documents, private_key, public_key, daybed = get_documents()
    docs = dict(((d['id'], d) for d in documents))
    if doc_id not in docs.keys():
        print("%s not found in %s" % (doc_id, docs.keys()))
        sys.exit(2)

    participant_keys = docs[doc_id]['participantsKeys']
    if hawk_id in participant_keys:
        del participant_keys[hawk_id]

    daybed.update_participant_keys(doc_id, participant_keys)
    daybed.remove_author_from_document(hawk_id, doc_id)

    print("%s has been unshare from %s." % (hawk_id, doc_id))
