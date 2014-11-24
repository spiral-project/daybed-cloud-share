daybed-cloud-share
==================

This project is a PoC of how we could use daybed to share encrypted
documents in between people.


One part of the project is to enable public-key sharing in between peers.
The second part is to share a secret key in between each participants.


How does it works
-----------------


The encrypted file-sharing
++++++++++++++++++++++++++

Each a participant has a key-pair (pubKey, privKey).
A document has a secret-key: dKey
And we also create a temporary keypair: (temp_pub_key, temp_priv_key)


The document is encrypted with dKey: encrypted_document.
The dKey is encrypted for each participant with: PublicBox(temp_priv_key, pubKey): encrypted_key.
The dKey is decrypted by a participant with: DH(privKey, temp_pub_key): dKey

Then the document is decrypted by the participant with dKey.


The public-key sharing
++++++++++++++++++++++

 - Each participant generates a key-pair (pPub, pPriv)
 - Then he uploads pPub to a Daybed document: daybed:cloud-share:pubkey-store/{hawkId}

When the owner wants to add a participant, it can ask the public-key
linked to his hawkid to daybed.

It is not possible to add a user that didn't register his public-key to daybed first.


How to use the tool?
--------------------

The daybed-cloud-crypt.key file
++++++++++++++++++++++++++++++++

It is a JSON file that contains both the hawk-session-token and the
associated PrivKey and PubKey.

By default the tools is looking at the ``~/.daybed-cloud-crypt.key``
file but you can use the ``-i`` option to select another one.


List your document
++++++++++++++++++

.. code-block:: bash

    $ cloud-share-list

    - ketulosa: natim/report.pdf
    - acetyrei: alexis/anotation.odt


Download a document
+++++++++++++++++++

.. code-block:: bash

    $ cloud-share-download ketulosa
    /tmp/report.pdf has been saved.

You can use the ``-o`` option to select another destination path.


Upload a document
+++++++++++++++++

.. code-block:: bash

    $ cloud-share-upload image.gif
	bibogahy: image.gif has been uploaded.


Share a document
++++++++++++++++

**If the user doesn't have a public-key**

.. code-block:: bash

    $ cloud-share-with bibogahy 5e5ebe7af77d5d9a41677b217318bbd1
    5e5ebe7af77d5d9a41677b217318bbd1: Public Key not found

**If the user has a public-key**

.. code-block:: bash

    $ cloud-share-with bibogahy f61ca1751ba322a42fc370b6e6121543
	bibogahy: image.gif has been shared with f61ca1751ba322a42fc370b6e6121543


Unshare a document
++++++++++++++++++

.. code-block:: bash

    $ cloud-share-remove bibogahy f61ca1751ba322a42fc370b6e6121543
	bibogahy is not anymore shared with f61ca1751ba322a42fc370b6e6121543


Delete a document
+++++++++++++++++

.. code-block:: bash

    $ cloud-share-delete bibogahy
	bibogahy has been deleted
