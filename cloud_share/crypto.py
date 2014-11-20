# -*- coding: utf-8 -*-
import requests
import nacl.utils
import nacl.secret

from nacl.public import PublicKey, PrivateKey, Box as PublicBox
from nacl.encoding import Base64Encoder

from cloud_share import config


class SignatureError(Exception):
    pass


class IdentifierNotFound(Exception):
    pass


def generate_keypair():
    private_key = PrivateKey.generate()
    public_key = private_key.public_key
    return private_key, public_key


def get_public_key(identifier):
    """Returns a public key for the given identifier.

    :param identifier: an email address or phone number or hawk id.

    """
    url = "%s/models/%s/records/%s" % (config.get("daybed_server"),
                                       config.get("pubkey_store_model_id"),
                                       identifier)
    r = requests.get(url)
    try:
        r.raise_for_status()
    except:
        raise IdentifierNotFound(r.json())
    return r.json()


def decrypt_message(encrypted_message, encrypted_key,
                    temp_public_key, private_key):
    """
    Decrypt the encrypted_message using the temp_public_key, the
    encrypted_key and the private_key

    """
    temp_public_key = PublicKey(
        temp_public_key,
        Base64Encoder)

    box = PublicBox(private_key, temp_public_key)

    message_key = box.decrypt(
        encrypted_key,
        encoder=Base64Encoder)

    # We got the key, so let's get the message.
    message_box = nacl.secret.SecretBox(message_key)
    message = message_box.decrypt(
        encrypted_message,
        encoder=Base64Encoder)

    return message


def encrypt_message(message):
    """Encrypt a message and return the message_key

    :param message: the message itself, in clear text.
    
    """
    # Cipher the message with a brand new random key.
    message_key = nacl.utils.random(nacl.secret.SecretBox.KEY_SIZE)
    message_box = nacl.secret.SecretBox(message_key)
    message_nonce = nacl.utils.random(nacl.secret.SecretBox.NONCE_SIZE)
    encrypted_message = message_box.encrypt(message, message_nonce,
                                            Base64Encoder)

    return message_key, encrypted_message


def encrypt_key(message_key, identifier):
    """Encrypt a message_key for a given identifier

    :param message_key: the key.
    :param identifier: the identifier of the message recipient.
    """
    recipient_pub_key = get_public_key(identifier)

    # Generate a new keypair & cipher the key with it.
    temp_private_key, temp_public_key = generate_keypair()
    box = PublicBox(temp_private_key, recipient_pub_key)
    nonce = nacl.utils.random(PublicBox.NONCE_SIZE)
    encrypted_key = box.encrypt(message_key, nonce, Base64Encoder)

    # Return the public key used to cipher the message key.
    return {
        'encrypted_key': encrypted_key,
        'temp_public_key': temp_public_key.encode(Base64Encoder)
    }
