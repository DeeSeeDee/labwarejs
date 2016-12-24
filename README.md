# labwarejs
Represent microplates using HTML/SVG and JavaScript.

*The easiest way to use labwarejs in your project is to grab the labware.min.js file*

# Background

My goal at the outset was to keep dependencies at a minimum. At present, `labwarejs` only requires jQuery. In the future, this may change as I expand the baked-in capabilities of the library. For example, I've thought of leveraging d3's color scales to indicate the volume in a microplate well or the number of reads in a flowcell lane. Handlebars or lodash templates would also be a big help. 

# What's Inside

## Microplates

A Microplate has wells in rows and columns. These wells can have a `square`, `rounded` square, or `circle` shape. 

A Microplate can also have annotations--row and column labels. To enable annotations, pass `annotation: true` when instantiating a Microplate, and make sure your `padding` value is at least `20`.

By default, a new Microplate will have 96 circular wells.

You can pass any number of optional attributes to a Microplate instance:

   attributes {
      'id': 'myplate'
   }

## Advanced

### Coordinates

By default, microplate coordinates are specified using letters for rows and numbers for columns. This can be changed by specifying `letter` or `number` for the `rowIterator` or `colIterator` property at instantiation.

### Dimensions

You can set the plate `margin`, `padding`, and `wellGap` values at instantiation.

### Styling microplates

Microplates are styled as black with white wells by default. You can style a microplate using CSS and svg properties.

### Volume tracking

The `Well` prototype contains methods for volume tracking. The `maxVolume` property of the well instance must be set. From there the `addVol` and `removeVol` methods can add and subtract volume from the wells down to zero and up to the `maxVolume` value. There are also `empty` and `full` boolean properties.

### Extending 

If you want to attach event handlers to a component to make it interactive, the following component-class associations may be helpful:

Each `Well` element has a `well` class.

The `Microplate` rectangle has a `plate` class.

Annotation text elements have an `annotation` class.

## Examples

#### Create a new microplate

    var plate = new Microplate();
    $('#target_div').append(plate.render());
    
#### Create a new microplate with annotations and rounded square wells

    var plate = new Microplate({
        padding: 30,
        annotations: true,
        wellShape: 'rounded'
    });
    $('#target_div').append(plate.render());
    
#### Create a 24-well microplate with circular wells and labels

    var plate = new Microplate({
        padding:30,
        annotations: true,
        wellShape: 'circle',
        rows: 4,
        columns: 6
    });
    $('#target_div').append(plate.render());
    
#### Create a microplate with a special ID and style it garishly

    var funkyPlate = new Microplate({
        padding: 30,
        annotations: true,
        wellShape: 'square',
        attributes: {
            'id': 'funky'
        }
    });
	$('#target_div').append(funkyPlate.render());
    
Then in your CSS you can do something like:

    #funky text.annotation{
        fill: pink;
    }
    
    #funky .plate{
        fill: purple;
    }
    
    #funky .well{
        fill: yellow;
        stroke: white;
    }

## Flowcells

A `Flowcell` prototype models Illumina flowcells and has one or more `Lane` instances.

## Advanced

### Styling flowcells

Flowcells are styled as black with white lanes by default. You can style a flowcell using CSS and svg properties. See the examples for more detail.

#### Cluster tracking

The `Lane` prototype can track the number of clusters. If the `clusters` property value exceeds the `Lane`'s `maxClusters` property value, the `overClustered` property will return `true`. Similarly, you can see the cluster density as a percentage via the `percentFull` property.

#### Tiles

Illumina flowcells are subdivided into surfaces, swathes, and tiles. There's currently no visual representation of these concepts, but you can store integer values for the properties and get the total tiles via the `totalTiles` property of the `Lane` prototype.

### Extending 

If you want to attach event handlers to a component to make it interactive, the following component-class associations may be helpful:

Each `Flowcell` element has a `flowcell` class.

Each `Lane` element has a `lane` class.

## Examples

#### Create a new flowcell with labeled lanes

    var flowcell = new Flowcell({
		lanes: 8,
		padding: 20,
		annotations: true
	});
	$('#target_div').append(flowcell.render());