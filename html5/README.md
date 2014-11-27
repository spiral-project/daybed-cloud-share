# Daybed Cloud Share

This project is an attempt to show how we could use Firefox Account
with Daybed to create a file sharing application that respect the user
privacy.

## What can you do?

For this first version you can:

 - Upload a document
 - Rename it
 - Share it with somebody
 - Delete it

Appart from the file sharing, the app also handle public key sharing.

## How to install it locally?

If you want to work with the formbuilder, or hack on it, then you'll need to
install it. To do so, it's easy:

    $ npm install
    $ npm start

… and you should see your favorite browser open with the app running there for
you.

## Design

Here are some notes about the overall design we're using for this form builder.

### How the components work together?

Here is an overview of how the react components work together:

    <CloudShareApp>
      <FileDropZone />
      <FilesList>
        <FileItem />
      </FilesList>
    </CloudShareApp>

### What's the data flow?

We're using Flux to dispatch the actions, meaning that the CloudShareApp
contains a reference to a store where we store all the form elements that
had been added / configured to the app.

When an action takes place, any of the elements can trigger it and it will
update the data, and the elements will be re-rendered.

              ———| Action |<——— triggers ———
     updates |                              |
              ——>| Store | — updates ——> | App | ——> | Component2 |
                                            |
                                             ——————> | Component2 |

### I want to follow development!

Cool, have a look at [the
pad](http://pad.spiral-project.org/p/daybed-cloud-share) we're using to track
what still needs to be done.

## Credits

We are using libsodium for encryption.


## Encryption internals

### The encrypted file-sharing

Each a participant has a key-pair (pubKey, privKey).
A document has a secret-key: dKey
And we also create a temporary keypair: (temp_pub_key, temp_priv_key)


The document is encrypted with dKey: encrypted_document.
The dKey is encrypted for each participant with: PublicBox(temp_priv_key, pubKey): encrypted_key.
The dKey is decrypted by a participant with: DH(privKey, temp_pub_key): dKey

Then the document is decrypted by the participant with dKey.


### The public-key sharing

 - Each participant generates a key-pair (pPub, pPriv)
 - Then he uploads pPub to a Daybed document: daybed:cloud-share:pubkey-store/{hawkId}

When the owner wants to add a participant, it can ask the public-key
linked to his hawkid to daybed.

It is not possible to add a user that didn't register his public-key to daybed first.
