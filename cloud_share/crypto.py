# -*- coding: utf-8 -*-
import nacl.utils
import nacl.secret

from nacl.public import PublicKey, PrivateKey, Box as PublicBox
from nacl.encoding import HexEncoder, Base64Encoder


class SignatureError(Exception):
    pass


def load_keypair(key):
    keypair = PrivateKey(key, HexEncoder)
    return keypair, keypair.public_key


def generate_keypair():
    private_key = PrivateKey.generate()
    public_key = private_key.public_key
    return private_key, public_key


def decrypt_key(encrypted_key, temp_public_key, private_key):
    """Decrypt the document encrypted key using the temp_public_key and
    the private_key.

    """
    temp_public_key = PublicKey(
        temp_public_key,
        HexEncoder)

    box = PublicBox(private_key, temp_public_key)

    message_key = box.decrypt(
        encrypted_key,
        encoder=Base64Encoder)

    return message_key


def decrypt_message(encrypted_message, encrypted_key,
                    temp_public_key, private_key):
    """
    Decrypt the encrypted_message using the temp_public_key, the
    encrypted_key and the private_key

    """
    message_key = decrypt_key(encrypted_key, temp_public_key, private_key)

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


def encrypt_key(message_key, recipient_pub_key):
    """Encrypt a message_key for a given identifier

    :param message_key: the key.
    :param identifier: the identifier of the message recipient.
    """
    # Generate a new keypair & cipher the key with it.
    temp_private_key, temp_public_key = generate_keypair()
    recipient_pub_key = PublicKey(
        recipient_pub_key,
        HexEncoder)
    print(temp_private_key, recipient_pub_key)
    box = PublicBox(temp_private_key, recipient_pub_key)
    nonce = nacl.utils.random(PublicBox.NONCE_SIZE)
    encrypted_key = box.encrypt(message_key, nonce, Base64Encoder)

    # Return the public key used to cipher the message key.
    return {
        'encrypted_key': encrypted_key,
        'temp_public_key': temp_public_key.encode(HexEncoder)
    }
