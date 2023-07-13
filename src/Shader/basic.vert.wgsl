@binding(0) @group(0) var<uniform> projectionMatrix : mat4x4<f32>;

struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
};

@vertex
fn vs_main(
    @location(0) position : vec3<f32>
) -> VertexOutput {

    var output : VertexOutput;
    output.Position = projectionMatrix * vec4(position,1.0);
    return output;
}
