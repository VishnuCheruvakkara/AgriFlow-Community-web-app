
    secure_url, _ = cloudinary_url(
        public_id,
        type="authenticated",
        secure=True,
        sign_url=True,
        sign_valid_until=int(time.time()) + expires_in
    )
    return secure_url

########################################################