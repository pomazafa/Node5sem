exports.Resolvers = {
    all: function(args, context) {
        return context.getAll();
    },

    one: function (args, context) {
        return context.getOne(args.x);
    }
} 	