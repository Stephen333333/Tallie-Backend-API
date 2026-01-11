declare module 'mongoose-schema-jsonschema' {
    import { Schema } from 'mongoose';
    function mongooseToJsonSchema(schema: Schema): any;
    export default mongooseToJsonSchema;
}