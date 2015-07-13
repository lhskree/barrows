# barrows

Barrows is a php microblog with a simple authoring interface and database / client encryption. After a post is published, it's encrypted, and a key is returned to the authoring interface. This key isn't stored in the database. You have to pass the key along to have users decrypt the posts on the client side. There's still a lot to be done - I'll make an issues list soon.
